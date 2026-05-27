import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="px-6 md:px-10 pt-8 md:pt-10">
      <ol className="flex items-center gap-3 flex-wrap eyebrow text-ink/55">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-3">
              {item.href && !isLast ? (
                <Link href={item.href} className="btn-line">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-ink' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden className="text-ink/30">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
