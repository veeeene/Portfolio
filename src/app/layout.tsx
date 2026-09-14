import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Justine Veneracion — Full-Stack Developer & IT Student",
  description:
    "Portfolio of Justine T. Veneracion — Full-Stack Developer and IT Student at Bulacan State University specializing in Web and Mobile Application Development.",
  openGraph: {
    title: "Justine Veneracion — Full-Stack Developer",
    description:
      "Full-Stack Developer & IT Student building modern web platforms, offline-first applications, and 2D games.",
    url: "https://github.com/veeeene",
    siteName: "Justine Veneracion Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Google Fonts Preconnect and Geist + Geist Mono + Source Serif 4 stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@300..600&family=Source+Serif+4:ital,wght@0,400..600;1,400..600&display=swap"
          rel="stylesheet"
        />

        {/* Inline script to prevent FOUC for dark mode preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const mq = window.matchMedia('(prefers-color-scheme: dark)');
                  const isDark = stored === 'dark' || ((!stored || stored === 'system') && mq.matches);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans relative overflow-x-hidden antialiased bg-white text-ink dark:bg-[#0c0c0f] dark:text-[#f4f4f5]"
      >
        {children}
      </body>
    </html>
  );
}
