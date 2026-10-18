import { compileVault } from '@red-cup-engineering/education-platform-service/compile';
import { extractEquivoExercises } from './extract.mjs';
import { fileURLToPath } from 'node:url';

const CORPUS_ROOT = fileURLToPath(new URL('./corpus/', import.meta.url));

export function buildEquivoWorld() {
  const { world } = compileVault(CORPUS_ROOT, { id: 'equivo' }, { dialect: 'house' });
  return { ...world, exercises: world.rooms.flatMap((room) => extractEquivoExercises(room)) };
}
