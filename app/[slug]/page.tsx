import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import { getContentBySlug, getAllSlugs } from '../lib/mdx';
import { getPageBySlug } from '../lib/pages';
import { PageHeader } from '../components/PageHeader';
import { Backlink } from '../components/Backlink';
import { Callout } from '../components/Callout';
import { GraphView } from '../components/GraphView';
import { Toggle } from '../components/Toggle';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  return {
    title: page?.title || slug,
    description: page?.description || '',
  };
}

const components = {
  Backlink,
  Callout,
  GraphView,
  Toggle,
};

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);
  const pageMeta = getPageBySlug(slug);

  if (!content) {
    notFound();
  }

  const title = content.frontmatter.title || pageMeta?.title || slug;

  return (
    <article className="content" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
      <PageHeader title={title} />
      <div className="mdx-content">
        <MDXRemote
          source={content.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypePrettyCode, { theme: 'github-light', keepBackground: false }]]
            }
          }}
        />
      </div>
    </article>
  );
}
