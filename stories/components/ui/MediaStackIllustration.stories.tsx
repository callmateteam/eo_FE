import type { Meta, StoryObj } from "@storybook/nextjs";

import { MediaStackIllustration } from "@/components/ui/MediaStackIllustration";

const meta = {
  title: "Components/MediaStackIllustration",
  component: MediaStackIllustration,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof MediaStackIllustration>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
