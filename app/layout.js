import "./globals.css";

import ScrollToTop from "@/components/ScrollToTop";

export const metadata = {
  title: "Slowink | Slow thoughts with Inky",
  description: "A calming coloring book with motivational quotes and Inky the octopus. Practice self-care and mindfulness through slow coloring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
