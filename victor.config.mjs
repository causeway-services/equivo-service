import { createEducationProjector } from '@red-cup-engineering/education-platform-service/projector';
import { renderMarkdownBlockHtml } from '@red-cup-engineering/markdown-engineering-services-section/render-markdown-block-html';
import { stripExerciseFences } from '@red-cup-engineering/education-platform-service/markdown';
import { equivoCourse } from './themes/equivo/course.mjs';

const world = equivoCourse.buildWorld();
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const notes = world.rooms.map((room) => `<details><summary>${escape(room.title)}</summary>${renderMarkdownBlockHtml(stripExerciseFences(room.body, ['equivo-exercise']), { headingOffset: 1 })}</details>`).join('\n');

export default {
  site: { name: 'Equivo', baseIri: 'https://equivo.play.561.group/', language: 'en' },
  home: false,
  archives: false,
  search: false,
  projectors: [createEducationProjector({
    course: { ...equivoCourse, buildWorld: () => world },
    brand: {
      title: 'Equivo',
      subtitle: 'Read evidence, connectivity, and marked-stage models.',
      orientationHtml: '<p>Seven rooms, thirty checks. Choose a room to begin; complete its checks to open the next. Three populated lenses change vocabulary while preserving the computation. Export your save to keep your progress outside this browser.</p><p>The lesson notes below work without JavaScript. The evidence wording was corrected on 2026-10-04: answers use <strong>for and against</strong>, rather than knowledge and confirmation. Existing saves remain usable.</p>',
      presentationHtml: '<p><label>Presentation lens <select id="lens-select" aria-label="Presentation lens"></select></label></p><p id="lens-absence-banner" hidden></p><p id="streak-display" role="status" aria-label="Streak status"></p>',
      sourceTitle: 'Read the lessons',
      sourceSpan: 12,
      sourceHtml: '<p>Open a lesson below to read or print it. These are explicit software models; a computed answer does not establish a real-world claim. Sources and limits appear in The Descent.</p>' + notes,
    },
  })],
};
