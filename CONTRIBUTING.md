# Contributing

## Questions

If you have questions about implementation of packages in your application (help/support), please use the [Github Discussions](https://github.com/rocket-science-core/core/discussions).

## Suggesting new features

If you have ideas for new features, create an issue if it doesn't already exist. Feel free to go ahead and try an implementation or spark up a conversation in the issues comments.

## Development

If you want to fix an issue or develop a new feature, follow these steps:

- Fork this repo.
- Install dependencies with `pnpm install`.
- Run in development mode with pnpm dev.
- Implement changes / tests in source files.
- Document changes in the appropriate doc page.
- Stage and commit your changes with commitizen `pnpm cz` or `npx cz`. Please follow the standards of [commitizen](https://github.com/commitizen/cz-cli).
- If you're making changes to any of the versioned packages, don't forget to add a [changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) with `pnpm changeset` or `npx changeset`. Your changeset should reflex the correct package version bumps.
- Submit PR for review.
