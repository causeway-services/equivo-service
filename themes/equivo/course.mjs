import { buildEquivoWorld } from './build-world.mjs';

export const equivoCourse = Object.freeze({
  id: 'equivo',
  buildWorld: buildEquivoWorld,
  adapter: Object.freeze({ source: new URL('./browser-adapter.mjs', import.meta.url), exportName: 'equivoAdapter' }),
});
