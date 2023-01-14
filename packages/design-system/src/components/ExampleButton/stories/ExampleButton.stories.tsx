import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import ExampleButton, { ExampleButtonProps } from "../ExampleButton";
import ExampleButtonMockData from "../mockdata";
import readme from "../README.md";

export default {
  title: "Design System/Example Button",
  component: ExampleButton,
} as ComponentMeta<typeof ExampleButton>;

export const MockData: ComponentStory<typeof ExampleButton> = (
  args: ExampleButtonProps
) => <ExampleButton {...args} />;
MockData.args = ExampleButtonMockData;
MockData.parameters = {
  readme: {
    sidebar: readme,
  },
};
