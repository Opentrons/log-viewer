# Contributing guide

Thanks for your interest in contributing to the Flex CRS Log Viewer! This Contributing Guide is intended to ensure best practices for both internal Opentrons contributors as well as any external contributors. We want to make sure you’re set up to contribute effectively, no matter if you’re helping us out with bug reports, code, documentation, feature suggestions, or anything else. This guide covers:

- [Opening Issues](#opening-issues)
- [Opening Pull Requests](#opening-pull-requests)
- [PR Etiquette](#pr-etiquette)
- [Commit Guidelines](#commit-guidelines)
- [Project and Repository Structure](#project-and-repository-structure)
- [Development Setup](#development-setup)


This Contributing Guide was influenced by a lot of work done on existing Contributing Guides. They're great reads if you have the time!

- [React.js Contributing Guide][react-contributing]
- [Node.js Contributing Guide][node-contributing]
- [Kibana Contributing Guide][kibana-contributing]

[react-contributing]: https://reactjs.org/docs/how-to-contribute.html
[node-contributing]: https://github.com/nodejs/node/blob/master/CONTRIBUTING.md
[kibana-contributing]: https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md

## Opening issues

Please note that the issues tab on this repo is disabled. This doesn't mean we don't want to hear from you; it just means that our [support page][support] is a much better way to do so.

## Opening pull requests

If you’d like to contribute code to the Flex CRS Log Viewer platform, pull requests (PRs) are the way to do it. Any code contributions are greatly appreciated! If you’re an external contributor, we’re going to assume you are familiar with the fork and pull request flow. If not, this [blog post by Scott Lowe][fork-and-pull] is a good introduction.

Please note that by contributing to the Flex CRS Log Viewer, you agree to share those contributions under the terms of the [Apache 2.0 license](./LICENSE).

Before opening any PR, please run through the following questions:

- Does this PR address an already open issue?
  - If not, please consider opening an issue first
  - This is to ensure you don't end up duplicating work or wasting time on a PR that won't be accepted
- Does this PR incorporate many different changes?
  - If yes, would the PR work better as a series of smaller PR's?
  - Our team is more than happy to help you figure out an incremental plan
- Does this PR include code changes without test and/or documentation updates?
  - If yes, your PR may not be ready to open
  - Tests and documentation are a vital part of any code contribution
- Are there a reasonable number of commits and are they properly informative?
  - The best kind of PR is a tiny PR with a single commit
  - To avoid introducing problems into our Git history, we may have to ask you to squash or otherwise amend your commit(s)
  - See [Commit Guidelines](#commit-guidelines) below for tips on keeping a good Git history

To ensure your code is reviewed quickly and thoroughly, please fill out the sections in the existing pull request template best of your ability! If you’d like some recommended reading for writing good pull requests, check out:

- [How to write the perfect pull request][how-to-write-pr]
- [The (written) unwritten guide to pull requests][unwritten-guide-to-pr]
- [The Art of a Pull Request][art-of-pr]

After your Pull Request is merged (or otherwise closed), you’ll want to make sure to delete the branch in GitHub. You probably want to delete your local branch, too, depending on your own personal organizational strategies / general paranoia.

### Deciding what to work on

If you're looking for something to work on, especially for a first contribution, check out [our list of easy issues][easyfix]. Be sure to drop a comment in the thread before starting work to make sure nobody else has picked it up.

## PR etiquette and conventions

Following these practices helps reviewers focus on substance rather than cleanup and keeps our codebase healthy. A guiding principle: **Does this PR alleviate the burden of the reviewer as best as possible?** Please also read through the [LLM Usage Guidelines](#LLM-system-usage-guidelines)

### Before marking a PR "ready for review"

- **Proofread the code.** Present a best-effort, functional solution.

- **Add appropriate tests and documentation.** Include tests and documentation as appropriate for the scope of the PR.

- **Smoke test the change.** Run through enough manual or automated checks to verify the change behaves as intended.

- **Keep your commit history reasonably tidy.** Use good commit messages. Ideally, confine each commit to one self-contained change. See [How to Write a Git Commit Message][commit-message-how-to] by Chris Beams for general guidance.

  Don't stress about this too much! When you merge your PR, all of your commits will get squashed down into one, and you'll have an opportunity to rewrite the final message. But it's nice to keep a tidy history, anyway. It helps others scan your changes. It also helps you in case you need to rework your PR with tools like `git revert`.

### While opening a PR

- **Fill out the PR template thoughtfully.** A well-filled template lets reviewers focus on substance rather than chasing basic questions. It reduces back-and-forth, speeds up review, and helps future maintainers. You're welcome to bend the template when it helps you communicate better (e.g., for a bug fix, overview + details might serve readers better than overview + changelog). Just be thoughtful about what you change and why.

- **Write a semantic PR title.** Following the [Conventional Commits][conventional-commits] specification, your PR title should have one of the following prefixes. For example: `fix(app): Fix spacing in the nav menu`
  - `feat` - A new feature
  - `fix` - A bug fix
  - `docs` - Documentation only changes
  - `style` - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc
  - `refactor` - A code change that neither fixes a bug nor adds a feature
  - `perf` - A code change that improves performance
  - `test` - Adding missing tests or correcting existing tests
  - `build` - Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  - `ci` - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
  - `chore` - Other changes that don't modify src or test files

### After receiving PR approval

- **Make sure all automated checks are passing.** See the [Testing](#Testing) and [Code quality](#Code-quality) sections for more details.
- **Perform a final smoke test** before merging, to confirm nothing regressed after approval.

### Writing the commit message and merging your PR

Normally, you will squash all of your commits into one when you merge your PR. GitHub will ask you to enter a summary and description of the squashed commit.

The summary should be your PR title, followed by your PR number. GitHub will normally prepopulate it, but double-check it. It should look like this:

```
fix(app): Fix spacing in the nav menu (#12345)
```

For the extended description, delete whatever GitHub prepopulates. In its place, write a concise overview, including ticket references. You might base it on the "Overview" and "Changelog" sections of your PR description. For instance:

```
This fixes a few things in the top-level navigation menu that didn't match the designs.
Closes TICKET-1234.

* Add more vertical space between the text and the underline.
* Vertically center the overflow button.
* Add more space to the right of the overflow button.
```

Good commit messages are essential to keeping an organized and readable Git history. A readable Git history makes our lives easier when doing necessary work like writing changelogs or tracking down regressions. Further reading: [How to Write a Git Commit Message][commit-message-how-to] by Chris Beams.

## LLM system usage guidelines

When submitting pull requests to the Opentrons repo, please keep the following rule in mind: **don't make anybody else interact with your LLM**. The code you submit is under your name, no matter what tools were used to generate it, and questions asked about it are asked to you.

That means:

- Look over the code before you submit it and make sure you're comfortable with it going out under your name
- Don't respond to reviews or questions with LLM output
- Don't cite "this is how the LLM did it" in response to a review

That doesn't mean:

- Every pull request must be perfect
- Anything with an em dash will be rejected

Maintainers of the repo follow the same rules, and will never ask you to respond to their LLM outputs.

## Project and repository structure

The Flex CRS Log Viewer is an Electron application composed of several different libraries, each of which lives in its own subdirectory. Since these libraries are all built into a single application, having them in one repository (also known as a monorepo) is convenient for keeping various inter-project dependencies in sync, but does require workflow considerations to keep everything organized and trackable.

Generally, the directory / file structure of our monorepo looks something like this:

- \[Project]
- \[Another Project]
- etc.
- `scripts` - Repository level scripts (mostly for CI)
- Justfile - top level task runner orchestration 
- Various repository level dotfiles (CI and git config)
- `README.md`, `CONTRIBUTING.md`, `LICENSE`, etc.

The projects in this repo use Typescript. Each project has its own `README` + `Justfile` + dependency management.

## Development setup

If you'd like to contribute (or maybe just run the very latest and greatest version), this section details what you need to do to get your computer and local repository set up.

Individual projects may have additional instructions, so be sure to check out the various project `README`s, too.

### System and repository setup

You will need the following tools installed to develop on the Opentrons platform.

- make
- git
- curl
- ssh
- Node.js v22.12.0+
- [pnpm][pnpm]

See [DEV_SETUP.md](./DEV_SETUP.md) for our recommended development setup guides for macOS, Windows, and Linux.

### Testing

We use:

- [Vitest][vitest] to test JavaScript
  - To run tests in watch mode, you should also install [watchman][]

You can tests with:

```shell
# run all tests (except e2e)
just test
```

You can pass some options to the JavaScript tests:

```shell
# run JavaScript tests in watch mode
just test-js watch=true

# disable test coverage
just test-js cover=false

# update snapshot tests
# https://vitest.dev/guide/snapshot.html
just test-js updateSnapshot=true
```

And you can run code linting / typechecking with:

```shell
# lint all code
just lint

# lint + typecheck specific languages
just lint-js
just lint-css
jsut check-js
```

[vitest]: https://vitest.dev/
[watchman]: https://facebook.github.io/watchman/

### Code quality

To help with code quality and maintainability, we use a collection of tools that can be roughly sorted into the following categories (with some overlaps):

- [Linters][lint]
  - Analyze the code for various potential bugs and errors
  - [ESLint][eslint] - JavaScript/JSON linter
  - [stylelint][] - CSS linter
- [Typecheckers][type-check]
  - Verify that the code is [type safe][type-safe]
  - [typescript][]
- Formatters
  - (Re)format source code to adhere to a consistent [style][code-style]
  - [Prettier][prettier] - Code formatter for JavaScript, JSON, Markdown, and YAML

These tools can be run with the following commands:

```shell
# lint all code and run all typechecks
just lint

# lint by language
just lint-js
just lint-json
just lint-css

# typecheck JavaScript code
just check-js

# format JavaScript, JSON, Markdown, and YAML
just format
```

[lint]: https://en.wikipedia.org/wiki/Lint_(software)
[type-check]: https://en.wikipedia.org/wiki/Type_system#Type_checking
[type-safe]: https://en.wikipedia.org/wiki/Type_safety
[code-style]: https://en.wikipedia.org/wiki/Programming_style
[eslint]: https://eslint.org/
[stylelint]: https://stylelint.io/
[typescript]: https://www.typescriptlang.org/
[prettier]: https://prettier.io/

#### Editor setup

Most, if not all, of the tools above have plugins available for your code editor that will run quality checks and formatting as you write and/or save. We **highly recommend** setting up your editor to format and check your code automatically.

- ESLint - <https://eslint.org/docs/user-guide/integrations#editors>
- stylelint - <https://stylelint.io/user-guide/complementary-tools/#editor-plugins>
- TypeScript - <https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support>
- Prettier - <https://prettier.io/docs/en/editors.html>

### Adding dependencies

#### JavaScript

JavaScript dependencies are installed by [pnpm][]. When calling pnpm, you should do so from the repository level.

##### Adding a development dependency

A development dependency is any dependency that is used only to help manage the project. Examples of development dependencies would be:

- Build tools (webpack, babel)
- Testing/linting/checking tools (vitest, typescript, eslint)
- Libraries used only in support scripts (aws, express)

To add a development dependency:

```shell
# with long option names
pnpm add -w --dev <dependency_name>

# or, with less typing
pnpm add -DW <dependency_name>
```

##### Adding a project dependency

A project dependency is a dependency that an application or library will `import` _at run time_. Examples of project dependencies would be:

- UI / state-management libraries (react, redux)
- General utility libraries (lodash)

Project dependencies should be added _to the specific project that depends on them_. To add one:

```shell
pnpm add -w --dev --filter=<project_name> <dependency_name>
```

##### Adding type definitions

After you have installed a dependency (development or project), you may find that you need to also install [typescript][] type definitions. Without type definitions for our external dependencies, we are unable to typecheck anything we `import`. If you are using a dependency that does not come with type definitions, see the [typescript consumption guide](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) for how to find and use community-created type definitions.

Not every JavaScript package has an available TypeScript definition. If you find yourself using such a library, you may need to create your own [ambient type declaration](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).


[easyfix]: https://github.com/Opentrons/opentrons/issues?q=is%3Aopen+is%3Aissue+label%3Aeasyfix
[support]: https://support.opentrons.com/
[fork-and-pull]: https://blog.scottlowe.org/2015/01/27/using-fork-branch-git-workflow/
[how-to-write-pr]: https://github.com/blog/1943-how-to-write-the-perfect-pull-request
[unwritten-guide-to-pr]: https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests
[art-of-pr]: https://ponyfoo.com/articles/art-of-pull-request
[commit-message-how-to]: https://chris.beams.io/posts/git-commit/
[makefiles]: https://en.wikipedia.org/wiki/Makefile
[nvm]: https://github.com/creationix/nvm
[pnpm]: https://pnpm.io/
[conventional-commits]: https://conventionalcommits.org/
[lerna]: https://github.com/lerna/lerna
[lerna-version]: https://github.com/lerna/lerna/tree/v3.16.4/commands/version
[semver-inc]: https://github.com/npm/node-semver#functions
