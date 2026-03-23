# Realtime Playground monorepo

![screenshot](./docs/screenshot.png)

## Structure

- `apps/next`: Next.js playground and test runner UI
- `apps/expo`: Expo playground and test runner UI
- `packages/realtime-core`: shared realtime controller, collectors, types, and schemas
- `packages/tests`: shared realtime test suites and test runner helpers

## Installation

1. Copy `example.env` to `.env`
2. Run `yarn install`
3. Run `yarn workspace @realtime-playground/next dev`

Both `apps/next` and `apps/expo` load environment variables from the repo root `.env`.
