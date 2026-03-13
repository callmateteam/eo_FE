import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Button } from "@/components/ui/Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "button",
    onClick: fn(),
    size: "md",
    state: "default",
    variant: "filled",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FilledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-900 p-6">
      <Button state="default">button</Button>
      <Button state="hovered">button</Button>
      <Button state="pressed">button</Button>
      <Button disabled>button</Button>
    </div>
  ),
};

export const OutlinedStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-900 p-6">
      <Button variant="outlined" size="sm" state="default">
        button
      </Button>
      <Button variant="outlined" size="sm" state="hovered">
        button
      </Button>
      <Button variant="outlined" size="sm" state="pressed">
        button
      </Button>
      <Button variant="outlined" size="sm" state="error">
        button
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-gray-900 p-6">
      <Button size="tiny">button</Button>
      <Button size="sm">button</Button>
      <Button size="md">button</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-900 p-6">
      <Button iconBefore="play-line">재생</Button>
      <Button iconAfter="right">다음</Button>
      <Button iconBefore="video" iconAfter="right" variant="outlined" size="sm">
        영상 만들기
      </Button>
    </div>
  ),
};
