import React from "react";
import Sidebar from "@/app/_components/EventSidebar";
import EventNavbar from "@/app/_components/EventNavbar";

interface EventLayoutProps {
  children: React.ReactNode;
}

const EventLayout: React.FC<EventLayoutProps> = ({ children }) => {
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
};

export default EventLayout;
