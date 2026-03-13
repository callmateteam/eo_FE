import type { Preview } from "@storybook/nextjs";

import "../app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "app-dark",
      values: [
        { name: "app-dark", value: "#121214" },
        { name: "app-light", value: "#f5f5f5" },
        { name: "white", value: "#ffffff" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
};

export default preview;
