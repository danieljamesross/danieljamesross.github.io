export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-8 font-mono text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between dark:text-white/50">
        <p>&copy; {new Date().getFullYear()} Daniel James Ross</p>
      </div>
    </footer>
  );
}
