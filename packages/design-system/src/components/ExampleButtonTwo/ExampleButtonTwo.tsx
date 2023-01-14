import React from "react";
import { ExampleButtonTwoWrapper } from "./styles";

export interface ExampleButtonTwoProps {
  buttonText: string;
  buttonClickHandler: () => any;
}

const ExampleButtonTwo = ({
  buttonText,
  buttonClickHandler,
}: ExampleButtonTwoProps) => {
  return (
    <ExampleButtonTwoWrapper onClick={buttonClickHandler}>
      {buttonText}
    </ExampleButtonTwoWrapper>
  );
};

export default ExampleButtonTwo;
