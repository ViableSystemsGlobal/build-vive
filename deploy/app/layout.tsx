import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ace Construction - Denver's Premier Construction Company",
  description: "Experience excellence in construction with Denver's most trusted construction company. Quality craftsmanship, innovative solutions, and unmatched service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body 
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}