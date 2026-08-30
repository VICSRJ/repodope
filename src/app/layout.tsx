import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoDope — Developer Workspace",
  description: "A lightweight GitHub-focused developer workspace for repositories, projects and activity.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
