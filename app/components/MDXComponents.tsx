'use client';

import type { MDXComponents } from 'mdx/types';
import { Backlink } from './Backlink';
import { Callout } from './Callout';

// Custom component to transform [[backlinks]] syntax
function BacklinkWrapper({ children }: { children: React.ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>;

  // Parse [[slug]] pattern
  const parts = children.split(/(\[\[[\w-]+\]\])/g);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[\[([\w-]+)\]\]$/);
        if (match) {
          return <Backlink key={index} to={match[1]} />;
        }
        return part;
      })}
    </>
  );
}

export const mdxComponents: MDXComponents = {
  // Override default elements
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  p: ({ children }) => {
    if (typeof children === 'string' && children.includes('[[')) {
      return (
        <p>
          <BacklinkWrapper>{children}</BacklinkWrapper>
        </p>
      );
    }
    return <p>{children}</p>;
  },

  // Custom components
  Backlink,
  Callout,
};
