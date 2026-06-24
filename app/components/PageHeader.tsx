import Link from 'next/link';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <Link href="/" className="back-link">
        <span aria-hidden="true">&larr;</span> Back to Overview
      </Link>
      <h1>{title}</h1>
    </header>
  );
}
