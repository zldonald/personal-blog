import Link from 'next/link';
import type { PageMeta } from '../lib/pages';

interface PageCardProps {
  page: PageMeta;
}

export function PageCard({ page }: PageCardProps) {
  return (
    <Link href={`/${page.slug}`} className="page-card">
      <span className="page-card-icon">{page.icon}</span>
      <h2 className="page-card-title">{page.title}</h2>
      <p className="page-card-description">{page.description}</p>
    </Link>
  );
}
