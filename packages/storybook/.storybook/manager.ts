import { addons } from "@storybook/addons";
//@ts-ignore
import { themes } from "@storybook/theming";

// import RocketScienceTheme from "./theme";

const temporaryTheme = {
  ...themes.light,
  brandTitle: "Rocket Science",
  brandUrl: "https://github.com/rocket-science-core/core",
  brandImage:
    "https://createrocketscience.app/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2F2539a349-7af8-4896-bd66-f8d808f23999%2Fimages%2F344dee36-a9fd-40e8-824a-37409ebc46bf.png&w=640&q=80",
};

addons.setConfig({
  theme: temporaryTheme,
});
