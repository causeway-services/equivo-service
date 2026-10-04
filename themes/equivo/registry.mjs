/**
 * Course checks over the authored utterances, evidence sides, finite graphs,
 * and marked-stage records. The graph and stage readings are separate models;
 * neither establishes that a proposition is true or that a cycle is harmful.
 * Repair remains available as a checker but is outside the launch curriculum.
 */
import { cell, claimValue, sidesOf, tokenValue, utterance } from '@red-cup-engineering/signcell/cell';
import { readingOfSides } from '@red-cup-engineering/computer-data-engineering-services-section/four';
import { site } from '@red-cup-engineering/signgraph/site';
import { cohomologyOfCells } from '@red-cup-engineering/signgraph/cohomology';
import { settling, classify, h1 } from '@red-cup-engineering/metrologic/obstruction/settling';

// ---------------------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------------------

/** The knowledge reading of a told pair [for, against]: [F,F] absurd, [T,F] potential, [F,T] active,
 * [T,T] stable (SignChain). */
export function readingOfValue(value) {
  return readingOfSides('knowledge', value[0], value[1]);
}

/** An utterance's reflexive cell: its claim about its token. */
function utteranceCell(spec, evidence) {
  const [token, claim] = spec.utterance;
  return cell(token, claim, token, evidence);
}

/** The cohomology the settle and repair checkers read: entities, H0 rank, H1 rank (SignGraph). */
function relationCohomology(cells) {
  const reading = cohomologyOfCells(cells);
  return { entities: reading.entities, H0: { rank: reading.zeroCohomology.rank }, H1: { rank: reading.firstCohomology.rank } };
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ---------------------------------------------------------------------------------------
// A -- distinguish: articulate(utterance)
// ---------------------------------------------------------------------------------------

/** Player names the two atoms (token, claim) in a scenario, in order. The checker runs the real
 * `articulate` on the spec's utterance -- if it throws (malformed input), that itself is
 * diagnostic; otherwise the player's proposed `potential` pair must match exactly. */
export function distinguishChecker(spec, answer) {
  let result;
  try {
    const said = utterance(...spec.utterance);
    result = { potential: [tokenValue(said), claimValue(said)] };
  } catch (err) {
    return { pass: false, diagnosis: `the utterance itself is malformed: ${err instanceof Error ? err.message : String(err)}` };
  }
  const pass = deepEqual(result.potential, answer.potential);
  return {
    pass,
    diagnosis: pass
      ? `correct -- articulate witnesses [${result.potential.join(', ')}] as the potential`
      : `articulate witnesses [${result.potential.join(', ')}] as the potential; you answered [${answer.potential.join(', ')}]`,
  };
}

// ---------------------------------------------------------------------------------------
// B -- relate: predicate(articulate(utterance))
// ---------------------------------------------------------------------------------------

/** Player builds the subject/predicate/object cell-set from a token+claim. The checker runs the
 * real `predicate(articulate(utterance))` and compares the resulting cell-set's entity-set and
 * predicate-set to the player's answer -- structural, not string, match. */
export function relateChecker(spec, answer) {
  const related = site([utteranceCell(spec)]);
  const actual = { entities: related.entities, predicates: related.predicates };
  const pass = deepEqual(actual.entities, answer.entities) && deepEqual(actual.predicates, answer.predicates);
  return {
    pass,
    diagnosis: pass
      ? `correct -- predicate witnesses entities=[${actual.entities.join(', ')}] predicates=[${actual.predicates.join(', ')}]`
      : `predicate witnesses entities=[${actual.entities.join(', ')}] predicates=[${actual.predicates.join(', ')}]; you answered entities=[${answer.entities.join(', ')}] predicates=[${answer.predicates.join(', ')}]`,
  };
}

// ---------------------------------------------------------------------------------------
// C -- measure: posit(predicate(articulate(utterance))), settled reading
// ---------------------------------------------------------------------------------------

/** Read the evidence on the exercise's already-closed reflexive cell. */
export function measureChecker(spec, answer) {
  // This exercise has one reflexive cell and no transport or inference rules.
  // Its closure is already fixed; constructing a settlement adds no evidence.
  const settled = utteranceCell(spec, { for: [spec.utterance] });
  if (!settled) return { pass: false, diagnosis: 'the descent produced no settled cell -- malformed spec' };
  const actual = sidesOf(settled);
  const pass = actual[0] === answer.value[0] && actual[1] === answer.value[1];
  return {
    pass,
    diagnosis: pass
      ? `correct -- settles to [${actual}] (${readingOfValue(actual)}), evidence for=${JSON.stringify(settled.for)}`
      : `the descent settles to [${actual}] (${readingOfValue(actual)}), you answered [${answer.value}] (${readingOfValue(answer.value)})`,
  };
}

// ---------------------------------------------------------------------------------------
// D -- settle/equivalence: relationCohomology(cells), H0.rank === 1
// ---------------------------------------------------------------------------------------

/** Read connectivity of the equivalence relation generated by the graph's edges. */
export function settleChecker(spec, answer) {
  const result = relationCohomology(spec.cells);
  const actuallyEquivalent = result.H0.rank === 1;
  const pass = actuallyEquivalent === answer.claim;
  return {
    pass,
    diagnosis: pass
      ? `correct -- H0 rank ${result.H0.rank} (${actuallyEquivalent ? 'one component, equivalent' : `${result.H0.rank} components, NOT equivalent`}), H1 rank ${result.H1.rank}`
      : `you claimed ${answer.claim ? 'equivalent' : 'not equivalent'}, but H0 rank is ${result.H0.rank} over ${result.entities.length} entities and ${spec.cells.length} cells -- it ${actuallyEquivalent ? 'DOES' : 'does NOT'} settle to one component`,
  };
}

// ---------------------------------------------------------------------------------------
// E -- observe/regime: classify(settling) + h1(settling)
// ---------------------------------------------------------------------------------------

/** Classify the finite marked-stage record using the declared stage model. */
export function observeChecker(spec, answer) {
  const v = settling(spec.stages, spec.opts ?? {});
  const cls = classify(v);
  const obstruction = h1(v);
  const pass = answer.regime === cls.regime && answer.h1Vanishes === obstruction.vanishes;
  return {
    pass,
    diagnosis: pass
      ? `correct -- regime "${cls.regime}" at depth ${cls.depth}, H1 rank ${obstruction.rank} (vanishes=${obstruction.vanishes})`
      : `you answered regime="${answer.regime}" h1Vanishes=${answer.h1Vanishes}; the settling is actually regime="${cls.regime}" (depth ${cls.depth}), H1 rank ${obstruction.rank} (vanishes=${obstruction.vanishes})`,
  };
}

// ---------------------------------------------------------------------------------------
// F -- repair: re-run cohomologyOfRelation on the player's edited cells
// ---------------------------------------------------------------------------------------

/**
 * equivo-design.md §3's honesty note, implemented as designed and NOT softened: the checker is
 * mechanically well-defined (re-run `cohomologyOfRelation`, require `H1.rank === 0`), but "what
 * counts as a good repair" has no corpus-attested vocabulary. This build adds ONE disclosed,
 * admittedly weak heuristic against the trivial evasion the design calls out (deleting the
 * obstructing cell entirely): the player's edited entity set must be a SUPERSET of the original's
 * (a repair that removes an entity outright cannot be told apart from "avoided the disagreement
 * by erasing part of the question," so it is rejected). This does NOT solve "genuine repair vs.
 * evasion" in general -- equivo-design.md §8 defers type F from the launch curriculum for exactly
 * this reason, and no corpus content in this build ships a repair exercise. Kept here, tested,
 * disclosed, and unused in play -- the honest state the design doc itself describes.
 */
export function repairChecker(spec, answer) {
  const before = relationCohomology(spec.cells);
  const after = relationCohomology(answer.cells);
  const beforeEntities = new Set(before.entities);
  const afterEntities = new Set(after.entities);
  const keptEveryEntity = [...beforeEntities].every((e) => afterEntities.has(e));
  const resolved = after.H1.rank === 0;
  const pass = resolved && keptEveryEntity;
  if (!resolved) {
    return { pass: false, diagnosis: `the edited relation still carries an obstruction: H1 rank ${after.H1.rank}` };
  }
  if (!keptEveryEntity) {
    return { pass: false, diagnosis: 'the obstruction is gone, but only because an original entity was deleted rather than reconciled -- see this checker\'s own disclosed limitation' };
  }
  return { pass: true, diagnosis: `repaired -- H1 rank now 0, every original entity retained (H0 rank ${after.H0.rank})` };
}

// ---------------------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------------------

export const equivoCheckers = {
  distinguish: distinguishChecker,
  relate: relateChecker,
  measure: measureChecker,
  settle: settleChecker,
  observe: observeChecker,
  repair: repairChecker,
};

/** The kinds this build actually authors corpus content for (equivo-design.md §8's MVP cut:
 * A/B as warm-up, C/D/E as the graded core; F deferred entirely). Exposed so the content
 * validator (test/content-validate.test.mts) can assert no room ships a `repair` exercise. */
export const MVP_KINDS = ['distinguish', 'relate', 'measure', 'settle', 'observe'];
