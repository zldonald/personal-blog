import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MDXContent {
  slug: string;
  content: string;
  frontmatter: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
}

export function getContentBySlug(slug: string): MDXContent | null {
  const fullPath = path.join(contentDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    frontmatter: data,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

// Parse [[backlinks]] from MDX content
export function parseBacklinks(content: string): string[] {
  const backlinkRegex = /\[\[([\w-]+)\]\]/g;
  const matches = content.matchAll(backlinkRegex);
  const links = new Set<string>();

  for (const match of matches) {
    links.add(match[1]);
  }

  return Array.from(links);
}
