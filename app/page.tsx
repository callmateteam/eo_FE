import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-canvas px-6 py-10">
      <section className="w-full max-w-3xl rounded-[32px] border border-border-subtle bg-surface-elevated p-10 shadow-[0_24px_80px_rgba(18,18,20,0.08)]">
        <div className="space-y-4">
          <p className="text-label-sm text-action-secondary">Design System</p>
          <h1 className="text-display-xl text-text-primary">
            Shared component preview is ready.
          </h1>
          <p className="text-body-lg max-w-2xl text-text-secondary">
            The component showcase page includes buttons, navigation, chips,
            inputs, icons, step bars, loading states, and illustration samples.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="text-label-md inline-flex h-12 items-center justify-center rounded-full bg-action-primary px-6 text-text-inverse transition-colors hover:bg-action-primary-hover"
            href="/showcase"
          >
            Open Showcase
          </Link>
        </div>
      </section>
    </main>
  );
}
