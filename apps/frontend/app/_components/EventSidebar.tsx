import React from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, QrCode, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onOpenChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = useParams();

  const menuItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      path: `/event/${slug}`,
    },
    {
      title: "Attendance",
      icon: Users,
      path: `/event/${slug}/attendance`,
    },
    {
      title: "Scan",
      icon: QrCode,
      path: `/event/${slug}/scan`,
    },
    // {
    //   title: "Test",
    //   icon: TestTube,
    //   path: `/event/${slug}/test`,
    // },
    {
      title: "Admins",
      icon: UserCog,
      path: `/event/${slug}/admin`,
    },
  ];

  // const handleNavigation = (path: string) => {
  //   router.push(path);
  //   if (window.innerWidth < 1024) {
  //     // Close sidebar on navigation for mobile
  //     onOpenChange(false);
  //   }
  // };

  return (
    <div className="flex h-screen">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onOpenChange(!isOpen)}
        className="fixed top-4 right-4 z-[999] sm:hidden hover:bg-white/10"
      >
        <Menu className="h-6 w-6" />
      </Button>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-[55]"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-2xl z-[55]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="flex justify-end p-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 pt-4">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className={`w-full justify-start text-lg font-medium py-6 ${
                  pathname === item.path
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Link href={item.path}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
