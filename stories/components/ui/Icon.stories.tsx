import type { Meta, StoryObj } from "@storybook/nextjs";

import { Icon, type IconName } from "@/components/ui/Icon";

const iconNames: IconName[] = [
  "avatar",
  "check",
  "dashboard",
  "down",
  "left",
  "line",
  "pause",
  "pause-line",
  "play",
  "play-line",
  "plus",
  "redo",
  "right",
  "sound",
  "up",
  "view-off",
  "view-on",
  "video",
];

const meta = {
  title: "Foundation/Icons",
  component: Icon,
  tags: ["autodocs"],
  args: {
    name: "play-line",
  },
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div className="grid min-w-[720px] grid-cols-4 gap-4 rounded-3xl bg-gray-900 p-6 text-gray-50 md:grid-cols-6">
      {iconNames.map((name) => (
        <div
          key={name}
          className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gray-800 px-3 py-4"
        >
          <Icon name={name} />
          <span className="text-caption-sm text-center text-gray-300">{name}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 rounded-3xl bg-gray-900 p-8 text-gray-50">
      <Icon name="play-line" size={16} />
      <Icon name="play-line" size={24} />
      <Icon name="play-line" size={32} />
      <Icon name="play-line" size={40} />
    </div>
  ),
};
