import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dice Roller",
  description: "Roll any dice combination",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0f0f13", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
