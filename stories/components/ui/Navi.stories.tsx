import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Navi } from "@/components/ui/Navi";

const meta = {
  title: "Components/Navi",
  component: Navi,
  tags: ["autodocs"],
  args: {
    icon: "dashboard",
    onClick: fn(),
    state: "default",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof Navi>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <Navi state="default" />
      <Navi state="hovered" />
      <Navi state="clicked" />
    </div>
  ),
};
