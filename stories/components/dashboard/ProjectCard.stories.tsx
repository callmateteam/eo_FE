import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProjectCard } from "@/components/ui/ProjectCard";

const meta = {
  title: "Components/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
  args: {
    characterName: "name",
    imageSrc: "/assets/landing/cards/storyboard-cover-1.png",
    onDelete: () => undefined,
    onEdit: () => undefined,
    statusLabel: "진행 중",
    title: "Title",
  },
} satisfies Meta<typeof ProjectCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuOpen: Story = {
  args: {
    initialMenuOpen: true,
  },
};
