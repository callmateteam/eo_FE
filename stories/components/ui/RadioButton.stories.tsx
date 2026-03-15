import type { Meta, StoryObj } from "@storybook/nextjs";

import { RadioButton } from "@/components/ui/RadioButton";

const meta = {
  title: "Components/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex gap-6 rounded-3xl bg-gray-900 p-6">
      <RadioButton state="default" />
      <RadioButton state="selected" />
    </div>
  ),
};
