import "@/styles/globals.css";
import { Raleway, Fira_Code } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const display = Fira_Code({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Raleway({
  subsets: ["latin"],
  variable: "--font-body",
});
export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <main
        className={`${display.variable} ${body.variable} flex min-h-screen flex-col font-body text-base-600 dark:text-base-500 bg-base-50 dark:bg-base-950`}
      >
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
