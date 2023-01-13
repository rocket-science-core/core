import { addDecorator } from "@storybook/react"; // <- or your view layer
import { addReadme } from "storybook-readme";
import { withPerformance } from "storybook-addon-performance";

addDecorator(addReadme);
addDecorator(withPerformance);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
