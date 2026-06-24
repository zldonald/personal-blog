import { PageCard } from './components';
import { pages } from './lib/pages';

export default function Home() {
  return (
    <div className="content" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <h1>Things keeping me awake at 4am the day before my last exam.</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
        Thoughts, plans, and insights. <br />
        - Donald
      </p>

      <div className="page-grid">
        {pages.map((page) => (
          <PageCard key={page.slug} page={page} />
        ))}
      </div>
    </div>
  );
}
