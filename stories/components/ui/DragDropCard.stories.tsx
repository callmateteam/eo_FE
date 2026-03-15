import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { DragDropCard } from "@/components/ui/DragDropCard";

const meta = {
  title: "Patterns/DragDropCard",
  component: DragDropCard,
  tags: ["autodocs"],
  args: {
    onFilesChange: fn(),
    title: "이미지 파일 업로드",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof DragDropCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[760px] bg-gray-900 p-10">
      <DragDropCard {...args} />
    </div>
  ),
};

export const Hovered: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[760px] bg-gray-900 p-10">
      <DragDropCard {...args} state="hovered" />
    </div>
  ),
};

export const Pressed: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[760px] bg-gray-900 p-10">
      <DragDropCard {...args} state="pressed" />
    </div>
  ),
};

export const FileSizeError: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[760px] bg-gray-900 p-10">
      <DragDropCard {...args} state="file-size-error" />
    </div>
  ),
};

export const MinImageError: Story = {
  render: (args) => (
    <div className="mx-auto max-w-[760px] bg-gray-900 p-10">
      <DragDropCard {...args} state="min-image-error" />
    </div>
  ),
};
