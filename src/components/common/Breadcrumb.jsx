import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-navy-600">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-slate-700' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
