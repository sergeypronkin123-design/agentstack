import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const recipes = await getCollection('recipes');
  return rss({
    title: 'AgentStack — recipes',
    description: 'Multi-tool AI coding workflows, refreshed weekly.',
    site: context.site!,
    items: recipes
      .sort((a, b) => (a.data.updated < b.data.updated ? 1 : -1))
      .map((r) => ({
        title: r.data.title,
        description: r.data.description,
        pubDate: new Date(r.data.updated),
        link: `/recipes/${r.slug}`,
      })),
    customData: '<language>en-us</language>',
  });
}
