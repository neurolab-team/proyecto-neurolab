"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { openModal } = useModal();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNavigation = (path: string) => {
    setShowMobileMenu(false);
    router.push(path);
  };

  const navSkeleton = (
    <nav className="bg-[#001d4e] shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" />
      </div>
    </nav>
  );

  if (isLoading) return navSkeleton;

  const displayName = user ? user.name?.trim() || user.email : "";

  return (
    <nav className="bg-[#001d4e] shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavigation("/")}
            className="hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
            aria-label="Ir al inicio"
          >
            <img
              src="/img/logo-itm.png"
              alt="Logo ITM"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </button>

          {/* Botón hamburguesa (solo móvil) */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white border border-white/30 hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-expanded={showMobileMenu}
            aria-controls="navbar-mobile-menu"
            aria-label={showMobileMenu ? "Cerrar menú" : "Abrir menú"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {showMobileMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Acciones escritorio */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => openModal("login")}
                  className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium border border-white/30 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openModal("register")}
                  className="bg-white text-[#001d4e] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                {user.role === "user" && (
                  <button
                    onClick={() => handleNavigation("/panel/assignmentTest")}
                    className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium border border-white/30 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Mis Pruebas
                  </button>
                )}

                <div className="h-6 w-px bg-white/20 mx-1" />

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 text-white hover:bg-white/10 pl-3 pr-2 py-2 rounded-lg transition-all duration-300 text-sm font-medium border border-white/30 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    aria-expanded={showMenu}
                  >
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold uppercase">
                      {displayName.charAt(0)}
                    </div>
                    <span className="max-w-[120px] lg:max-w-[180px] truncate">
                      {displayName}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50 border border-slate-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Cuenta
                        </p>
                        <p className="text-sm font-medium text-slate-700 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          openModal("changePassword");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Cambiar contraseña
                      </button>
                      <div className="border-t border-slate-100 mt-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Panel móvil */}
      {showMobileMenu && (
        <div
          id="navbar-mobile-menu"
          className="md:hidden border-t border-white/10 px-4 pb-4 pt-3 space-y-2"
        >
          {!user ? (
            <>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  openModal("login");
                }}
                className="w-full text-white hover:bg-white/20 px-4 py-3 rounded-lg transition-colors text-sm font-medium border border-white/30 text-center"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  openModal("register");
                }}
                className="w-full bg-white text-[#001d4e] hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors text-sm font-bold text-center"
              >
                Registrarse
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 px-1 py-2">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold uppercase text-white shrink-0">
                  {displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-white/60 truncate">{user.email}</p>
                </div>
              </div>

              {user.role === "user" && (
                <button
                  onClick={() => handleNavigation("/panel/assignmentTest")}
                  className="w-full text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-sm font-medium border border-white/30 text-left"
                >
                  Mis Pruebas
                </button>
              )}

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  openModal("changePassword");
                }}
                className="w-full text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-colors text-sm font-medium border border-white/30 text-left"
              >
                Cambiar contraseña
              </button>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  logout();
                }}
                className="w-full bg-white/10 text-red-200 hover:bg-red-500/20 px-4 py-3 rounded-lg transition-colors text-sm font-semibold border border-red-300/40 text-left"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
