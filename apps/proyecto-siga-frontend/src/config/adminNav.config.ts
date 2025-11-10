import { House, Users, ClipboardList, Send, LineChart, Settings } from "lucide-react";
import { AppRole } from "../context/authContext"; 

// Mapeo de Iconos
export const ICONS = {
  House,
  Users,
  ClipboardList, 
  Send,
  LineChart,     
  Settings,
};

type IconName = keyof typeof ICONS;

// Interfaz con restricción de roles
interface SidebarItem {
  name: string;
  href: string;
  icon: IconName;
  requiredRoles: AppRole[];
}

// Configuración del Menú
export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "House",
    requiredRoles: ['admin', 'psychologist'],
  },
  {
    name: "Gestión de Usuarios",
    href: "/admin/users",
    icon: "Users",
    requiredRoles: ['admin'], 
  },
  {
    name: "Tests y Catálogo",
    href: "/admin/tests",
    icon: "ClipboardList",
    requiredRoles: ['admin', 'psychologist'],
  },
  {
    name: "Asignaciones",
    href: "/admin/assignments",
    icon: "Send",
    requiredRoles: ['psychologist'],
  },
  {
    name: "Reportes",
    href: "/admin/reports",
    icon: "LineChart",
    requiredRoles: ['admin', 'psychologist'],
  },
  {
    name: "Configuración",
    href: "/admin/settings",
    icon: "Settings",
    requiredRoles: ['admin'],
  },
];