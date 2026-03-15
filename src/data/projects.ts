export interface ProjectConfig {
  slug: string;
  name: string;
  githubRepo: string;
  docsPath: string;
  icon: string;
  iconColor: string;
  features: string[];
  featured: boolean;
}

export const projects: ProjectConfig[] = [
  {
    slug: 'anchor',
    name: 'Anchor',
    githubRepo: 'artcgranja/anchor',
    docsPath: '/anchor/',
    icon: 'anchor',
    iconColor: '#3b82f6',
    features: ['Hybrid RAG', 'Token Memory', 'Provider Agnostic'],
    featured: true,
  },
];
