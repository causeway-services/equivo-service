// What equivo.play.561.group publishes about itself to crawlers, card renderers and
// answer engines. scripts/apply-web-standards.mjs applies it to the built public/
// directory; the lesson list is read from the course world that build produced.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGIN = 'https://equivo.play.561.group';
const NAME = 'Equivo';
const TAGLINE = 'A course in obstruction-measurement mathematics';
const TITLE = 'Equivo: a course in obstruction-measurement mathematics';

export default async function standards({ dir, configDir }) {
  const world = JSON.parse(await readFile(join(dir, 'data/equivo-world.json'), 'utf8'));
  const lessons = world.rooms.filter((room) => room.kind === 'lesson' || room.kind === 'overview');
  const exercises = world.exercises.length;
  const description = `A public course on obstruction-measurement mathematics: ${lessons.length} lessons and ${exercises} exercises on evidence readings, graph connectivity and marked-stage models.`;
  if (description.length < 50 || description.length > 160) throw new Error(`description is ${description.length} characters`);
  const organization = { '@type': 'Organization', '@id': 'https://561.group/#organization', name: '561 Group', url: 'https://561.group/', logo: `${ORIGIN}/logo.png` };
  const llms = [
    `# ${NAME}`, '',
    `> ${description} Part of Play, the 561 Group's catalog of browser games and courses.`, '',
    'Progress is saved in your own browser; export your save before leaving. Completing the course practices the readings; it is not a certification of mathematical mastery.', '',
    '## Course', '',
    `- [Equivo](${ORIGIN}/): the whole course on one page, with ${lessons.length} lessons (${lessons.map((room) => room.title).join('; ')}) and ${exercises} checked exercises`,
    `- [Course data](${ORIGIN}/data/equivo-world.json): the lessons, doors between them, review cards and exercises as JSON`, '',
    '## Optional', '',
    '- [Play](https://play.561.group/): the catalog of 561 Group games and courses',
    '- [561 Group](https://561.group/): the publisher', '',
  ].join('\n');
  return {
    origin: ORIGIN, name: NAME, tagline: TAGLINE, description, contact: 'cto@561.group',
    brandDir: join(configDir, 'brand'),
    feeds: [
      { type: 'application/rss+xml', title: 'Equivo RSS', href: '/feed.rss.xml' },
      { type: 'application/atom+xml', title: 'Equivo Atom', href: '/feed.atom.xml' },
      { type: 'application/feed+json', title: 'Equivo JSON Feed', href: '/feed.json' },
    ],
    // The course fetches its world JSON from this origin; its inline stylesheet and tile
    // style attributes need 'unsafe-inline' styles; saved practice exports as a blob download.
    csp: { img: ['blob:'] },
    llms,
    pages: [
      {
        path: '/', file: 'index.html', title: TITLE, ogTitle: TITLE,
        jsonLd: [{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: NAME, description, inLanguage: 'en', publisher: { '@id': organization['@id'] } },
            organization,
            { '@type': 'Course', '@id': `${ORIGIN}/#course`, name: NAME, description, url: `${ORIGIN}/`, inLanguage: 'en', isAccessibleForFree: true, provider: { '@id': organization['@id'] } },
          ],
        }],
      },
      { path: '/atlas', file: 'atlas/index.html', description: 'Equivo pages ordered by date created, newest first.' },
      { path: '/404', file: '404.html', noindex: true, sitemap: false },
    ],
  };
}
