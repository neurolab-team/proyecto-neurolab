import { useRouter } from 'next/router';
import { useState} from 'react'; 
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import ChangePasswordModal from './ChangePasswordModal';
import { useAuth } from '../hooks/useAuth'; 

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] shadow-lg">
        <div className="w-full px-8">
          <div className="flex items-center justify-between h-20">
            {/* Espacio reservado para mantener la altura */}
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="bg-gradient-to-r from-[#102D69] to-[#00A0B7] shadow-lg">
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-20">
          <div className="text-white">
            <div className="font-bold text-lg">Sistema de Evaluación Psicológica</div>
            <div className="text-sm text-blue-100">Instituto Tecnológico Metropolitano</div>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div 
              onClick={() => handleNavigation('/')} 
              className="hover:bg-white/10 rounded-lg transition-all border border-white/30 p-2"
              style={{ cursor: 'pointer' }}
            >
              <img 
                src="/img/logo-itm.png" 
                alt="Logo ITM" 
                className="w-40 h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!user ? (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all font-medium border border-white/30"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-white text-[#102D69] hover:bg-blue-50 px-5 py-2 rounded-lg transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all font-medium border border-white/30 flex items-center space-x-2"
                >
                  <span>{user.name?.trim() || user.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowChangePasswordModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cambiar Contraseña
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />

      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onClose={() => setShowChangePasswordModal(false)}
      />
    </nav>
  );
}