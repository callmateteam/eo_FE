import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProjectCreateCard } from "@/components/dashboard/ProjectCreateCard";

const meta = {
  title: "Dashboard/ProjectCreateCard",
  component: ProjectCreateCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
} satisfies Meta<typeof ProjectCreateCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
