import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnkSIEM",
  description: "A mini SIEM dashboard for real-time log monitoring and threat detection"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
