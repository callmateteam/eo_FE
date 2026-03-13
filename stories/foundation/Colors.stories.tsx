import type { Meta, StoryObj } from "@storybook/nextjs";

const colorGroups = {
  Gray: [
    ["gray-50", "#f5f5f5"],
    ["gray-100", "#e5e5ea"],
    ["gray-300", "#8e8e93"],
    ["gray-500", "#4c4c50"],
    ["gray-700", "#2c2c31"],
    ["gray-800", "#1e1e22"],
    ["gray-900", "#121214"],
  ],
  Primary: [
    ["primary-500", "#ba4eff"],
    ["primary-600", "#8a3ed9"],
    ["primary-700", "#6b2bb1"],
  ],
  Secondary: [["secondary-500", "#6954f9"]],
  Status: [
    ["warning-500", "#ffd600"],
    ["error-500", "#ff5252"],
    ["success-500", "#00e676"],
  ],
} as const;

function ColorsShowcase() {
  return (
    <div className="flex min-w-[920px] flex-col gap-10 bg-gray-900 p-10 text-gray-50">
      {Object.entries(colorGroups).map(([group, colors]) => (
        <section key={group} className="space-y-4">
          <h2 className="text-heading-xl">{group}</h2>
          <div className="grid grid-cols-4 gap-4">
            {colors.map(([label, value]) => (
              <div key={label} className="overflow-hidden rounded-3xl border border-white/10 bg-gray-800">
                <div className="h-28" style={{ backgroundColor: value }} />
                <div className="space-y-1 p-4">
                  <p className="text-heading-md m-0">{label}</p>
                  <p className="text-body-md m-0 text-gray-300">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="space-y-4">
        <h2 className="text-heading-xl">Brand Gradient</h2>
        <div className="h-28 rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#6954f9_0%,#ba4eff_100%)]" />
      </section>
    </div>
  );
}

const meta = {
  title: "Foundation/Colors",
  component: ColorsShowcase,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ColorsShowcase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
