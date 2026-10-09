import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ customItems }) => {
  const location = useLocation();

  let items = [];

  if (customItems) {
    items = customItems;
  } else {
    const pathnames = location.pathname.split('/').filter(x => x);
    items = pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const formattedName = value
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return { label: formattedName, to };
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100 border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-600">
        <Link to="/" className="flex items-center hover:text-navy transition-colors">
          <Home className="w-4 h-4 mr-1 text-gold" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {isLast || !item.to ? (
                <span className="text-navy font-semibold truncate">{item.label}</span>
              ) : (
                <Link to={item.to} className="hover:text-navy transition-colors truncate">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
