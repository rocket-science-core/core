import { addDecorator } from "@storybook/react"; // <- or your view layer
import { addReadme } from "storybook-readme";
import { withPerformance } from "storybook-addon-performance";
import { initialize, mswDecorator } from "msw-storybook-addon";

// Initialize MSW
initialize({
  onUnhandledRequest: ({ method, url }) => {
    if (url.pathname.startsWith("/my-specific-api-path")) {
      console.error(`Unhandled ${method} request to ${url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
    }
  },
});

//decorators
addDecorator(addReadme);
addDecorator(withPerformance);

export const decorators = [mswDecorator];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers: {
      //   auth: [
      //     rest.get('/login', (req, res, ctx) => {
      //        return res(
      //          ctx.json({
      //             success: true,
      //          })
      //        )
      //     }),
      //     rest.get('/logout', (req, res, ctx) => {
      //        return res(
      //          ctx.json({
      //             success: true,
      //          })
      //        )
      //     }),
      //  ],
      //  profile: rest.get('/profile', (req, res, ctx) => {
      //   return res(
      //    ctx.json({
      //     firstName: 'Neil',
      //     lastName: 'Maverick',
      //    })
      //   )
      // }),
      // }
    },
  },
};
