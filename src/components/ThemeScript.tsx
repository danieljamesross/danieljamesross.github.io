export const THEME_KEY = "theme";

/**
 * Applies a theme picked with ThemeToggle before the first paint, so a
 * returning visitor never sees the other one flash. With no choice saved,
 * the page follows the system setting through CSS alone.
 */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
      }}
    />
  );
}
