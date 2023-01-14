# ExampleButton component

A react component for custom buttons.

## Properties

| Property           | Type      | Required | Description                                      |
| ------------------ | --------- | -------- | ------------------------------------------------ |
| buttonText         | string    | true     | Text to be displayed on the button               |
| buttonClickHandler | () => any | true     | Function to be called when the button is clicked |

## Integration guide

1. Import the ExampleButton component:

```js
import ExampleButton from "./ExampleButton";
```

2. Use the component and supply the required props:

```js
<ExampleButton
  buttonText="Click me"
  buttonClickHandler={console.log("button was clicked")}
/>
```

3. The button should now be ready to be used.
