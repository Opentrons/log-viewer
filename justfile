default_port := '3000'
test_target := ''
test_opts := ''
default_build_id := "dev"

setup:
    pnpm install

[working-directory: './app-shell']
electron-rebuild:
    pnpm run electron-rebuild

[working-directory: './app-shell']
dist-shell:
    rm -rf lib
    pnpm exec vite build

[working-directory: './app']
dist-app:
    rm -rf lib
    pnpm exec vite build

[working-directory: './app-shell']
[parallel]
build $BUILD_ID=default_build_id: dist-app dist-shell
    pnpm electron-builder

[working-directory: './app-shell']
build-only:
    pnpm electron-builder

[working-directory: './app-shell']
dev-shell port=default_port: dist-shell
    pnpm electron . \
    --devtools \
    --log.level.console="debug" \
    --ui.url.protocol="http:" \
    --ui.url.path="localhost:{{port}}" \

[working-directory: './app-shell']
dev-shell-dist:
    pnpm electron . \
    --devtools \
    --log.level.console="debug" \
    --ui.url.protocol="file:" \
    --ui.url.path="./app/dist/index.html" \

[working-directory: './app']
dev-app port=default_port:
    pnpm vite . --strictPort --port {{port}}

[parallel]
dev port=default_port: (dev-app port) (dev-shell port)

format:
    pnpm exec oxfmt 

format-check:
    pnpm exec oxfmt --check

type:
    pnpm tsc --watch

lint:
    pnpm exec oxlint

[env("VITE_AUDITLOG_FIXTURES", join(justfile_directory(), "app-shell",  "__fixtures__"))]
test target=test_target opts=test_opts:
    pnpm exec vitest {{target}} {{opts}}
