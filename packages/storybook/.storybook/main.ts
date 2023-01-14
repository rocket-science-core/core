import type { StorybookConfig } from "@storybook/core-common";
import { Configuration } from "webpack";
const glob = require("glob");

type monorepoPackage = {
  location: string;
  package: {
    name: string;
    version: string;
    main: string;
    license: string;
    dependencies: Object;
    devDependencies: Object;
    publishConfig: Object;
  };
};

const getPackages: (
  monorepoRootRelativePath: string
) => monorepoPackage[] = require("get-monorepo-packages");

const packages: monorepoPackage[] = getPackages("../../").filter(
  (pkg) => !pkg.package.name.includes("storybook")
);

const storiesInPackages: string[] = packages
  .map(({ location }) => {
    // const loc = location.split("/").splice(1, 2).join("/");
    const files = glob.sync(
      `${location}/src/**/*.stories.@(js|jsx|ts|tsx|mdx)`
    );

    if (files.length > 0) {
      return files;
    } else {
      return [];
    }
  })
  .flat()
  .map((story) =>
    story
      .split("/")
      .filter((dir: string) => !dir.includes("packages"))
      .join("/")
  );

console.log("===== storiesInPackages ===== ");
console.log(storiesInPackages);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)", ...storiesInPackages],
  features: { buildStoriesJson: true },
  addons: [
    "storybook-readme",
    "storybook-addon-performance/register",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    { name: "@storybook/addon-essentials", options: { actions: false } },
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: (
    config: Configuration
    // { configType }
  ) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config?.module?.rules?.push({
      test: /\.tsx?$/,
      loader: "esbuild-loader",
      options: {
        loader: "tsx",
        target: "es2015",
      },
    });

    config?.module?.rules?.push({
      test: /\.ts?$/,
      loader: "esbuild-loader",
      options: {
        loader: "ts",
        target: "es2015",
      },
    });

    config?.module?.rules?.push({
      test: /\.md$/,
      use: [
        {
          loader: "markdown-loader",
        },
      ],
    });

    // Return the altered config
    return config;
  },
};
console.log("===== config.stories ===== ");

console.log(config.stories);

module.exports = config;
