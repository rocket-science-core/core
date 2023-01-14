import React from "react";
import { ExampleButtonWrapper } from "./styles";

export interface ExampleButtonProps {
  buttonText: string;
  buttonClickHandler: () => any;
}

const ExampleButton = ({
  buttonText,
  buttonClickHandler,
}: ExampleButtonProps) => {
  return (
    <ExampleButtonWrapper onClick={buttonClickHandler}>
      {buttonText}
    </ExampleButtonWrapper>
  );
};

export default ExampleButton;
