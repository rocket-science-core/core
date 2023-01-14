
## ExampleButtonTwo Component
ExampleButtonTwo is a React component that creates a wrapped button with given text, and an onClick event handler.

### Props
| Prop | Type | Description | 
| ---- | ---- | ----------- | 
| buttonText | String | The text to be displayed on the button | 
| buttonClickHandler | Function | The function to be called when the button is clicked |  

### Integration Guide
1. Import the ExampleButtonTwo component from the styles folder
```jsx
import { ExampleButtonTwoWrapper } from "./styles";
```
2. Add the component to the JSX where needed
```jsx
<ExampleButtonTwoWrapper
  buttonText="Click me!"
  buttonClickHandler={() => alert("You clicked the button!")}
/>
```