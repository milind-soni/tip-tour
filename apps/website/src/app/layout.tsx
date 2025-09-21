import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./tiptour.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TipTour — Interactive cursor tooltips & guided workflows",
    template: "%s | TipTour",
  },
  description:
    "Smooth, performant tooltip library with cursor-follow, arrows, and a workflow layer to record & replay UI steps.",
  icons: { icon: "/favicon.ico" },
  metadataBase: typeof window === "undefined" ? new URL("https://tiptour.app") : undefined,
  openGraph: {
    title: "TipTour — Interactive cursor tooltips & guided workflows",
    description:
      "Smooth, performant tooltip library with cursor-follow, arrows, and a workflow layer to record & replay UI steps.",
    url: "https://tiptour.app",
    siteName: "TipTour",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TipTour — Interactive cursor tooltips & guided workflows",
    description:
      "Smooth, performant tooltip library with cursor-follow, arrows, and a workflow layer to record & replay UI steps.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
