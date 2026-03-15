import type { Meta, StoryObj } from "@storybook/nextjs";

import { Badge } from "@/components/ui/Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    text: "text",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-3 rounded-3xl bg-gray-900 p-6">
      <Badge color="blue" />
      <Badge color="pink" />
      <Badge color="gray" />
    </div>
  ),
};
