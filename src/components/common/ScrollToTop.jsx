import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll main window to top
    window.scrollTo(0, 0);

    // Scroll any inner scrollable main containers to top if present
    const mainContainers = document.querySelectorAll('main, .overflow-y-auto');
    mainContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};
