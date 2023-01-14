//@ts-ignore
import { create } from "@storybook/theming";

const RocketScienceTheme = create({
  base: "dark", // light or dark

  colorPrimary: "hotpink",
  colorSecondary: "deepskyblue",

  // UI
  appBg: "white",
  appContentBg: "silver",
  appBorderColor: "grey",
  appBorderRadius: 6,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: "monospace",

  // Text colors
  textColor: "#181818",
  textInverseColor: "rgba(255,255,255,0.9)",

  // Toolbar default and active colors
  barTextColor: "silver",
  barSelectedColor: "black",
  barBg: "hotpink",

  // Form colors
  inputBg: "white",
  inputBorder: "silver",
  inputTextColor: "black",
  inputBorderRadius: 4,

  brandTitle: "Rocket Science",
  brandUrl: "https://github.com/rocket-science-core/core",
  brandImage:
    "https://createrocketscience.app/_next/image?url=https%3A%2F%2Fsuper-static-assets.s3.amazonaws.com%2F2539a349-7af8-4896-bd66-f8d808f23999%2Fimages%2F344dee36-a9fd-40e8-824a-37409ebc46bf.png&w=640&q=80",
});

export default RocketScienceTheme;
