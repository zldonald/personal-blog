export interface PageMeta {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export const pages: PageMeta[] = [
  {
    slug: 'manifesto',
    title: 'Manifesto',
    icon: '📜',
    description: 'The importance of taste and human judgement in a world converging towards the AI dialect',
  },
  {
    slug: 'solution',
    title: 'Solution',
    icon: '💡',
    description: 'How Tact solves the convergence problem',
  },
  {
    slug: 'funding-views',
    title: 'Funding Views',
    icon: '💰',
    description: 'Our perspective on funding and the route to the US',
  },
  // {
  //   slug: 'us-plan',
  //   title: 'US Plan',
  //   icon: '🇺🇸',
  //   description: 'Market entry strategy and expansion roadmap',
  // },
  {
    slug: 'company-plan',
    title: 'Company Plan',
    icon: '🏢',
    description: 'Building the organization and team structure',
  },
  // {
  //   slug: 'work-to-date',
  //   title: 'Work to Date',
  //   icon: '⚡',
  //   description: 'Progress, milestones, and achievements so far',
  // },
  // {
  //   slug: 'market-competition',
  //   title: 'Market & Competition',
  //   icon: '📊',
  //   description: 'Industry landscape and competitive analysis',
  // },
];

export function getPageBySlug(slug: string): PageMeta | undefined {
  return pages.find((page) => page.slug === slug);
}

export function getPageTitle(slug: string): string {
  const page = getPageBySlug(slug);
  return page?.title || slug;
}
