default_port := '3000'
test_target := ''
test_opts := ''

setup:
    pnpm install

[working-directory: './app-shell']
electron-rebuild:
    pnpm run electron-rebuild

[working-directory: './app-shell']
dist-shell:
    pnpm exec vite build

[working-directory: './app']
dist-app:
    pnpm exec vite build

build:
    pnpm run electron-builder

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

test target=test_target opts=test_opts:
    pnpm exec vitest {{target}} {{opts}}
