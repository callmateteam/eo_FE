import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { NavigationRail } from "@/components/ui/NavigationRail";

const meta = {
  title: "Components/NavigationRail",
  component: NavigationRail,
  tags: ["autodocs"],
  args: {
    icon: "dashboard",
    label: "nav",
    onClick: fn(),
    state: "default",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof NavigationRail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex gap-6 rounded-3xl bg-gray-900 p-6">
      <NavigationRail state="default" label="home" />
      <NavigationRail state="hovered" label="video" icon="video" />
      <NavigationRail state="clicked" label="profile" icon="avatar" />
    </div>
  ),
};
