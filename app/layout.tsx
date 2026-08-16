import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata = {
  title: "Popin",
  description: "www.popin.to",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
