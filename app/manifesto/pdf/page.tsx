import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getContentBySlug } from '../../lib/mdx';
import { Backlink } from '../../components/Backlink';
import { Callout } from '../../components/Callout';

export const metadata = {
  title: 'Manifesto - PDF Export',
  robots: 'noindex, nofollow',
};

const components = {
  Backlink: ({ to, children }: { to: string; children?: React.ReactNode }) => (
    <span style={{ fontWeight: 500 }}>{children || to}</span>
  ),
  Callout,
};

export default async function PDFPage() {
  const content = getContentBySlug('manifesto');

  if (!content) {
    return <div>Content not found</div>;
  }

  return (
    <>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .pdf-container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
        @page {
          margin: 1in;
          size: A4;
        }
      `}</style>
      <article className="pdf-container" style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#3D3D3D',
        background: '#fff',
      }}>
        <header style={{
          marginBottom: '3rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid #5B8A72',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#5B8A72',
            lineHeight: 1.3,
            margin: 0,
          }}>
            {content.frontmatter.title || 'Manifesto'}
          </h1>
        </header>

        <div className="pdf-content" style={{

        }}>
          <MDXRemote
            source={content.content}
            components={components}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <footer style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #EDEAE4',
          fontSize: '12px',
          color: '#7A7A7A',
        }}>
          <p style={{ margin: 0 }}>Donald La</p>
        </footer>
      </article>
    </>
  );
}
