import type { Meta, StoryObj } from "@storybook/nextjs";

import { ScriptInputField } from "@/components/ui/ScriptInputField";

const meta = {
  title: "Components/ScriptInputField",
  component: ScriptInputField,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof ScriptInputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div className="flex gap-4 rounded-3xl bg-gray-900 p-6">
      <ScriptInputField state="default">text</ScriptInputField>
      <ScriptInputField state="selected">text</ScriptInputField>
    </div>
  ),
};
