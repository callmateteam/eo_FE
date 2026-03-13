import type { Meta, StoryObj } from "@storybook/nextjs";

import { InputField } from "@/components/ui/InputField";

const meta = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  args: {
    placeholder: "내용을 입력하세요",
  },
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex min-w-[480px] flex-col gap-4 rounded-3xl bg-gray-900 p-6">
      <InputField fieldState="default" defaultValue="text" />
      <InputField fieldState="hovered" defaultValue="text" />
      <InputField fieldState="pressed" defaultValue="text" />
      <InputField fieldState="error" defaultValue="text" errorMessage="오류 메시지" />
    </div>
  ),
};

export const WithLabelAndIcon: Story = {
  render: () => (
    <div className="min-w-[480px] rounded-3xl bg-gray-900 p-6">
      <InputField
        defaultValue="creator@easyonly.ai"
        fieldState="pressed"
        label="이메일"
        leadingIcon="avatar"
      />
    </div>
  ),
};

export const PlaceholderOnly: Story = {
  args: {
    defaultValue: undefined,
    placeholder: "검색어를 입력하세요",
    fieldState: "default",
  },
};

export const PasswordToggle: Story = {
  render: () => (
    <div className="min-w-[480px] rounded-3xl bg-gray-900 p-6">
      <InputField
        defaultValue="secret-password"
        fieldState="pressed"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        type="password"
      />
    </div>
  ),
};
