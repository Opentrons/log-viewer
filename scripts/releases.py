import argparse
import copy
import json
from pathlib import Path
from urllib.parse import quote, unquote, urlparse

import semver

INSTALLERS = {
    "win": (".msi",),
    "mac": (".dmg",),
    "linux": (".AppImage",),
}
STABLE_NAMES = {
    "win": "Log Viewer.msi",
    "mac": "Log Viewer.dmg",
    "linux": "Log Viewer.AppImage",
}


def select_installers(filenames):
    chosen = {}
    for platform, extensions in INSTALLERS.items():
        matches = [name for name in filenames if name.endswith(extensions)]
        if len(matches) > 1:
            raise ValueError(f"Multiple {platform} installers: {', '.join(matches)}")
        if matches:
            chosen[platform] = matches[0]
    return chosen


def artifact_url(base_url, filename):
    return f"{base_url.rstrip('/')}/{quote(filename, safe='')}"


def update_releases(existing, version, filenames, base_url):
    if not version:
        raise ValueError("version is required")
    document = {"productionV1": {}} if existing is None else copy.deepcopy(existing)
    releases = document.get("productionV1")
    if not isinstance(releases, dict):
        releases = {}
        document["productionV1"] = releases

    installers = select_installers(filenames)
    if not installers:
        raise ValueError(f"No installers found for {version}")

    previous = releases.get(version) or {}
    entry = {
        platform: artifact_url(base_url, filename) for platform, filename in installers.items()
    }
    for flag in ("active", "revoked"):
        if isinstance(previous.get(flag), bool):
            entry[flag] = previous[flag]
    releases[version] = entry
    return document


def _releases_of(document):
    releases = document.get("productionV1") if isinstance(document, dict) else None
    if not isinstance(releases, dict):
        raise ValueError("releases.json is missing productionV1")
    return releases


def production_versions(releases):
    parsed = []
    for version, release in releases.items():
        try:
            parsed_version = semver.Version.parse(version)
        except ValueError:
            continue
        if parsed_version.prerelease is not None or parsed_version.build is not None:
            continue
        if release.get("revoked") is True:
            continue
        parsed.append(parsed_version)
    return [str(version) for version in sorted(parsed)]


def _set_active(releases, active_version):
    for version, release in releases.items():
        if version == active_version:
            release["active"] = True
        elif release.get("active") is True:
            release["active"] = False


def mark_latest_active(document):
    document = copy.deepcopy(document)
    releases = _releases_of(document)
    latest = production_versions(releases)
    if not latest:
        raise ValueError("No production release to activate")
    _set_active(releases, latest[-1])
    return document


def revoke_latest(document):
    document = copy.deepcopy(document)
    releases = _releases_of(document)
    latest = production_versions(releases)
    if not latest:
        raise ValueError("No production release to revoke")
    current = latest[-1]
    releases[current]["revoked"] = True
    releases[current]["active"] = False
    previous = production_versions(releases)
    _set_active(releases, previous[-1] if previous else None)
    return document


def active_release(document):
    releases = _releases_of(document)
    versions = [version for version, release in releases.items() if release.get("active") is True]
    if len(versions) > 1:
        raise ValueError(f"Multiple active releases: {', '.join(versions)}")
    if not versions:
        return None
    return versions[0], releases[versions[0]]


def s3_key(artifact_url):
    return unquote(urlparse(artifact_url).path.lstrip("/"))


def magic_links(document):
    active = active_release(document)
    if active is None:
        return []
    version, release = active
    links = []
    for platform, filename in STABLE_NAMES.items():
        artifact = release.get(platform)
        if not isinstance(artifact, str) or not artifact:
            continue
        links.append(
            {
                "platform": platform,
                "filename": filename,
                "version": version,
                "source_key": s3_key(artifact),
            }
        )
    return links


def _load(path):
    return json.loads(Path(path).read_text())


def _dump(document, path):
    Path(path).write_text(json.dumps(document, indent=2) + "\n")


def _filenames(artifact_dir):
    return [path.name for path in Path(artifact_dir).iterdir() if path.is_file()]


def main(argv=None):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    update = sub.add_parser("update")
    update.add_argument("releases")
    update.add_argument("version")
    update.add_argument("artifact_dir")
    update.add_argument("base_url")

    for name in ("activate", "revoke", "links"):
        command = sub.add_parser(name)
        command.add_argument("releases")

    args = parser.parse_args(argv)
    if args.command == "update":
        try:
            existing = _load(args.releases)
        except FileNotFoundError:
            existing = None
        _dump(
            update_releases(existing, args.version, _filenames(args.artifact_dir), args.base_url),
            args.releases,
        )
        return

    document = _load(args.releases)
    if args.command == "links":
        for link in magic_links(document):
            print(f"{link['filename']}\t{link['source_key']}")
        return

    updated = {"activate": mark_latest_active, "revoke": revoke_latest}[args.command](document)
    _dump(updated, args.releases)
    active = active_release(updated)
    print("No active release" if active is None else f"Active release {active[0]}")


if __name__ == "__main__":
    main()
