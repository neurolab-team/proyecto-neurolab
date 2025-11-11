import { useState, useEffect } from 'react';

// Hook para verificar si la pantalla coincide con un media query (ej. 'min-width: 768px')
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar si 'window' está disponible 
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      // Función para actualizar el estado
      const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

      // Set inicial
      setMatches(media.matches); 

      // Suscribir y limpiar
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
    return () => {}; // Limpieza si window no existe
  }, [query]);

  return matches;
};