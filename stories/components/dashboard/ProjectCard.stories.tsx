import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProjectCard } from "@/components/dashboard/ProjectCard";

const meta = {
  title: "Dashboard/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
  args: {
    index: 0,
    project: {
      id: "project-1",
      title: "Title",
      character_name: "name",
      character_image: "/assets/landing/cards/storyboard-cover-1.png",
      character_id: "character-1",
      created_at: "2026-03-16T00:00:00.000Z",
      progress: 12,
      status: "in_progress",
      status_label: "진행 중",
    },
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
