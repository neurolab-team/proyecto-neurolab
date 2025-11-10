"use client";

import Link from "next/link";
import {
  Bell,
  House,
  Info,
  Link as LinkIcon,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const ICONS = {
  House,
  Settings,
  Mail,
  Users,
  Bell,
  Info,
};

type IconName = keyof typeof ICONS;

interface SidebarItem {
  name: string;
  href: string;
  icon: IconName;
}

export function Sidebar() {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const pathname = usePathname();
  useEffect(() => {
    fetch("/data/data.json")
      .then((response) => response.json())
      .then((data) => setSidebarItems(data.sidebarItems));
  }, []);
  return (
    <div className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 w-64">
      <div className="h-full bg-[#441c67] backdrop-blur-md p-4 flex flex-col border-r border-[#220c36]">
        <nav className="mt-8 flex-grow">
          {sidebarItems.map((item) => {
            const IconComponent = ICONS[item.icon];
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#220c36] transition-colors mb-2 ${pathname === item.href ? "bg-[#441c67]" : ""}`}
                >
                  <IconComponent
                    size={20}
                    className="text-white"
                    style={{ minWidth: "20px" }}
                  />
                  <span className="ml-3 text-white">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
export default Sidebar;
