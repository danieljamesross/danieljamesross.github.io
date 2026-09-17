export default function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-black/15 px-2.5 py-0.5 font-mono text-xs text-black/60 dark:border-white/20 dark:text-white/60">
      {children}
    </span>
  );
}
