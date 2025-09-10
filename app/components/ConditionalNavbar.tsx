"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import BlogNavbar from "./BlogNavbar";
import FloatingChat from "./FloatingChat";

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isBlogPage = pathname.startsWith('/blog');

  if (isAdminPage) {
    // For admin pages, don't render navbar or floating chat
    return <>{children}</>;
  }

  if (isBlogPage) {
    // For blog pages, render BlogNavbar and floating chat
    return (
      <>
        <BlogNavbar />
        {children}
        <FloatingChat />
      </>
    );
  }

  // For regular pages, render navbar and floating chat
  return (
    <>
      <Navbar />
      {children}
      <FloatingChat />
    </>
  );
}
