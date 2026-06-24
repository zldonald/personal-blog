import Link from 'next/link';
import { getPageBySlug, getPageTitle } from '../lib/pages';

interface BacklinkProps {
  to: string;
  children?: React.ReactNode;
}

export function Backlink({ to, children }: BacklinkProps) {
  const page = getPageBySlug(to);
  const displayText = children || page?.title || to;

  return (
    <Link href={`/${to}`} className="backlink">
      {displayText}
    </Link>
  );
}
