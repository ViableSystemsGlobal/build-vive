"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import FloatingChat from "./FloatingChat";

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    // For admin pages, don't render navbar or floating chat
    return <>{children}</>;
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
