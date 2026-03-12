import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { DragDropCard } from "@/components/ui/DragDropCard";
import { Icon } from "@/components/ui/Icon";
import { InputField } from "@/components/ui/InputField";
import { MediaStackIllustration } from "@/components/ui/MediaStackIllustration";
import { Navi } from "@/components/ui/Navi";
import { NavigationRail } from "@/components/ui/NavigationRail";
import { SpinnerDots } from "@/components/ui/SpinnerDots";
import { StepBar } from "@/components/ui/StepBar";

const buttonStates = ["default", "hovered", "pressed"] as const;
const iconNames = [
  "dashboard",
  "video",
  "avatar",
  "plus",
  "redo",
  "sound",
  "left",
  "up",
  "right",
  "down",
  "line",
  "play",
  "play-line",
  "pause",
  "pause-line",
  "check",
] as const;

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-surface-canvas px-6 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-4xl border border-border-subtle bg-surface-elevated p-8 shadow-[0_24px_80px_rgba(18,18,20,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-label-sm text-action-secondary">
                Common Components Showcase
              </p>
              <h1 className="text-display-sm text-text-primary">
                Image matched component review
              </h1>
              <p className="text-body-lg text-text-secondary">
                Components are being tuned against the screenshot exports while
                still using the global token system.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <SpinnerDots />
              <NavigationRail icon="dashboard" label="nav" state="clicked" />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Buttons</h2>
              <p className="text-body-md text-text-secondary">
                Filled, outlined, error and disabled states.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="space-y-3">
                <p className="text-label-sm text-text-tertiary">Filled / md</p>
                <div className="flex flex-wrap gap-4 bg-black p-4">
                  {buttonStates.map((state) => (
                    <Button key={state} size="md" state={state}>
                      button
                    </Button>
                  ))}
                  <Button disabled size="md">
                    button
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-label-sm text-text-tertiary">
                  Outlined / sm
                </p>
                <div className="flex flex-wrap gap-4 bg-black p-4">
                  {buttonStates.map((state) => (
                    <Button
                      key={state}
                      size="sm"
                      state={state}
                      variant="outlined"
                    >
                      button
                    </Button>
                  ))}
                  <Button size="sm" state="error" variant="outlined">
                    button
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-label-sm text-text-tertiary">
                  Tiny variants
                </p>
                <div className="flex flex-wrap gap-4 bg-black p-4">
                  <Button size="tiny" variant="outlined">
                    button
                  </Button>
                  <Button size="tiny" state="hovered" variant="outlined">
                    button
                  </Button>
                  <Button size="tiny" state="pressed" variant="outlined">
                    button
                  </Button>
                  <Button disabled size="tiny">
                    button
                  </Button>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Navigation</h2>
              <p className="text-body-md text-text-secondary">
                Navi and navigation rail states.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-3 bg-black p-4">
                <Navi icon="dashboard" state="default" />
                <Navi icon="dashboard" state="hovered" />
                <Navi icon="dashboard" state="clicked" />
              </div>
              <div className="flex gap-6 bg-black p-4">
                <NavigationRail icon="dashboard" label="nav" state="default" />
                <NavigationRail icon="dashboard" label="nav" state="hovered" />
                <NavigationRail icon="dashboard" label="nav" state="clicked" />
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1.1fr_0.8fr]">
          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Chips</h2>
              <p className="text-body-md text-text-secondary">
                Filter and status selection.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 bg-black p-4">
              <Chip state="default">text</Chip>
              <Chip state="hovered">text</Chip>
              <Chip state="clicked">text</Chip>
            </div>
          </article>

          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">
                Input Fields
              </h2>
              <p className="text-body-md text-text-secondary">
                Default, focus and error surfaces.
              </p>
            </div>
            <div className="space-y-4 bg-black p-4">
              <InputField defaultValue="text" fieldState="default" />
              <InputField defaultValue="text" fieldState="hovered" />
              <InputField defaultValue="text" fieldState="pressed" />
              <InputField defaultValue="text" fieldState="error" />
            </div>
          </article>

          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Stepper</h2>
              <p className="text-body-md text-text-secondary">
                Progress indicator and loading.
              </p>
            </div>
            <div className="space-y-8 bg-black p-4">
              <StepBar
                steps={[
                  { label: "text", state: "default" },
                  { label: "text", state: "now" },
                ]}
              />
              <SpinnerDots />
            </div>
          </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Icons</h2>
              <p className="text-body-md text-text-secondary">
                Temporary SVG redraws until original vectors arrive.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 bg-black p-4 sm:grid-cols-5 lg:grid-cols-6">
              {iconNames.map((name) => (
                <div
                  className="flex flex-col items-center gap-3 rounded-2xl px-3 py-4 text-text-inverse"
                  key={name}
                >
                  <Icon name={name} />
                  <span className="text-caption-sm text-center text-text-tertiary">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-heading-lg text-text-primary">Drag & Drop</h2>
              <p className="text-body-md text-text-secondary">
                Click or drag files into the card.
              </p>
            </div>
            <DragDropCard />
          </article>
        </section>

        <section className="rounded-[28px] border border-border-subtle bg-surface-elevated p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-heading-lg text-text-primary">
              Interaction Asset
            </h2>
            <p className="text-body-md text-text-secondary">
              Current drag & drop illustration asset.
            </p>
          </div>
          <div className="bg-black p-4">
            <MediaStackIllustration />
          </div>
        </section>
      </div>
    </main>
  );
}
