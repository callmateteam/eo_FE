import type { Meta, StoryObj } from "@storybook/nextjs";

import { CharacterCard } from "@/components/ui/CharacterCard";

const meta = {
  title: "Components/CharacterCard",
  component: CharacterCard,
  tags: ["autodocs"],
  parameters: {
    backgrounds: {
      default: "app-dark",
    },
  },
  args: {
    badgeLabel: "My",
    imageSrc: "/assets/landing/cards/storyboard-cover-1.png",
    onDelete: () => undefined,
    onEdit: () => undefined,
    title: "캐릭터명",
  },
} satisfies Meta<typeof CharacterCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MenuOpen: Story = {
  args: {
    initialMenuOpen: true,
  },
};
