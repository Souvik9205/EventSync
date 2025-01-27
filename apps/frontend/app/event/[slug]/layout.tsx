"use client";
import EventNavbar from "@/app/_components/EventNavbar";
import Sidebar from "@/app/_components/EventSidebar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      />
      <main className="flex flex-col flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <EventNavbar />
        <div className="">{children}</div>
      </main>
    </div>
  );
}
