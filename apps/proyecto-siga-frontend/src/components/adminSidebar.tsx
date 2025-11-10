import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ADMIN_SIDEBAR_ITEMS, ICONS } from "../config/adminNav.config";
import { AppRole } from "../context/authContext";
import { Menu } from "lucide-react";

export function Sidebar() {
  // Obtener el rol real del usuario
  const { user, isLoading } = useAuth(); // user contiene ahora la propiedad 'role'

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Si aún está cargando la autenticación, no se renderiza nada
  if (isLoading) return null;

  // Si el usuario no está logueado o no tiene rol (aunque la protección de ruta debería evitar esto)
  //
  //
  //
  const userRole: AppRole = user?.role ?? "admin"; // Valor por defecto para evitar errores = "user"
  //
  //
  //

  // Filtrado por Rol: Solo muestra ítems donde el rol del usuario esté permitido
  const filteredSidebarItems = ADMIN_SIDEBAR_ITEMS.filter((item) =>
    item.requiredRoles.includes(userRole),
  );

  return (
    <div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
    >
      <div className="h-full bg-[#441c67] backdrop-blur-md p-4 flex flex-col border-r border-[#220c36] text-white">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-[#220c36] transition-colors max-w-fit cursor-pointer self-end mb-4"
        >
          <Menu size={24} />
        </button>

        <nav className="mt-8 flex-grow">
          {filteredSidebarItems.map((item) => {
            const IconComponent = ICONS[item.icon];
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href} legacyBehavior>
                <div
                  className={`
                    flex items-center p-3 text-sm font-medium rounded-lg transition-colors mb-2 cursor-pointer 
                    ${isActive ? "bg-[#220c36] text-white" : "hover:bg-[#2f2f2f] text-gray-300"}
                    ${isSidebarOpen ? "justify-start" : "justify-center"}
                  `}
                >
                  <IconComponent
                    size={20}
                    className="text-white flex-shrink-0"
                    style={{
                      minWidth: "20px",
                      marginRight: isSidebarOpen ? "12px" : "0px",
                    }}
                  />
                  {isSidebarOpen && (
                    <span className="truncate">{item.name}</span>
                  )}
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
