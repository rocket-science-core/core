// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import ExampleButtonTwo, { ExampleButtonTwoProps } from "../ExampleButtonTwo";
import ExampleButtonTwoMockData from "../mockdata";
import readme from "../README.md";

export default {
  title: "Design System/Example Button Two",
  component: ExampleButtonTwo,
} as ComponentMeta<typeof ExampleButtonTwo>;

export const MockData: ComponentStory<typeof ExampleButtonTwo> = (
  args: ExampleButtonTwoProps
) => <ExampleButtonTwo {...args} />;
MockData.args = ExampleButtonTwoMockData;
MockData.parameters = {
  readme: {
    sidebar: readme,
  },
};
