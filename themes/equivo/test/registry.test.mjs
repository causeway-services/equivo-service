/** Independent carrier readings and checker disagreement cases. */
import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { cell, utterance, tokenValue, claimValue, sidesOf } from '@red-cup-engineering/signcell/cell';
import { site } from '@red-cup-engineering/signgraph/site';
import { settleCells } from '@red-cup-engineering/signcraft/settle';
import { cohomologyOfCells } from '@red-cup-engineering/signgraph/cohomology';
const cohomologyOfRelation = (cells) => { const r = cohomologyOfCells(cells); return { entities: r.entities, H0: { rank: r.zeroCohomology.rank }, H1: { rank: r.firstCohomology.rank } }; };
import { settling, classify, h1 } from '@red-cup-engineering/metrologic/obstruction/settling';
import {
  distinguishChecker,
  relateChecker,
  measureChecker,
  settleChecker,
  observeChecker,
  repairChecker,
  readingOfValue,
  equivoCheckers,
  MVP_KINDS,
} from '../registry.mjs';

describe('readingOfValue -- the FOUR-value bilattice naming table', () => {
  test('[F,F]=absurd, [T,F]=potential, [F,T]=active, [T,T]=stable', () => {
    assert.equal(readingOfValue([false, false]), 'absurd');
    assert.equal(readingOfValue([true, false]), 'potential');
    assert.equal(readingOfValue([false, true]), 'active');
    assert.equal(readingOfValue([true, true]), 'stable');
  });
});

describe('distinguishChecker (type A)', () => {
  const spec = { utterance: ['3-3 stone', 'corner-invasion'] };

  test('correct answer -- matches real articulate() output exactly', () => {
    const said = utterance(...spec.utterance);
    const v = distinguishChecker(spec, { potential: [tokenValue(said), claimValue(said)] });
    assert.equal(v.pass, true);
    assert.match(v.diagnosis, /correct/);
  });

  test('wrong answer (reordered) fails, with a diagnosis naming the real result', () => {
    const v = distinguishChecker(spec, { potential: ['corner-invasion', '3-3 stone'] });
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /3-3 stone, corner-invasion/);
  });

  test('a malformed spec (single-element utterance) fails loud with a diagnosis, never throws', () => {
    const v = distinguishChecker({ utterance: [undefined, 'x'] }, { potential: ['x'] });
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /malformed/);
  });
});

describe('relateChecker (type B)', () => {
  const spec = { utterance: ['a fossil layer', 'the site predates the eruption'] };

  test('correct answer -- matches real predicate(articulate()) structural output', () => {
    const [token, claim] = spec.utterance;
    const related = site([cell(token, claim, token)]);
    const v = relateChecker(spec, { entities: related.entities, predicates: related.predicates });
    assert.equal(v.pass, true);
  });

  test('wrong answer (predicate/entity swapped) fails', () => {
    const v = relateChecker(spec, { entities: ['the site predates the eruption'], predicates: ['a fossil layer'] });
    assert.equal(v.pass, false);
  });
});

describe('measureChecker (type C) -- equivo-design.md §5.1', () => {
  const spec = { utterance: ['3-3 stone', 'corner-invasion'] };

  test('correct answer settles to [true,false] (potential), matching the design doc printed output exactly', () => {
    const v = measureChecker(spec, { value: [true, false] });
    assert.equal(v.pass, true);
    assert.match(v.diagnosis, /potential/);
  });

  test('wrong answer [true,true] (stable) fails, diagnosis names both the actual and claimed charge', () => {
    const v = measureChecker(spec, { value: [true, true] });
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /potential/);
    assert.match(v.diagnosis, /stable/);
  });

  test('independent re-derivation: for ANY two-element utterance, a bare descent always settles to potential -- a real structural fact about posit() seeding [T,F] with a single entity, not a checker assumption', () => {
    for (const u of [['x', 'y'], ['a rumor', 'the merger is happening'], ['sensor', 'sound']]) {
      const [token, claim] = u;
      const settled = settleCells([cell(token, claim, token, { for: [u] })]).settled[0];
      assert.deepEqual(sidesOf(settled), [true, false]);
    }
  });
});

describe('settleChecker (type D) -- equivo-design.md §5.2', () => {
  test('connected chain: H0 rank 1, claim=equivalent passes', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
    ] };
    const real = cohomologyOfRelation(spec.cells);
    assert.equal(real.H0.rank, 1);
    assert.equal(real.H1.rank, 0);
    assert.equal(settleChecker(spec, { claim: true }).pass, true);
    assert.equal(settleChecker(spec, { claim: false }).pass, false);
  });

  test('disjoint pairs: H0 rank 2, claim=equivalent FAILS (matching the design doc\'s "should fail" case)', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'C', predicate: 'equivalent-to', object: 'D' },
    ] };
    assert.equal(cohomologyOfRelation(spec.cells).H0.rank, 2);
    const v = settleChecker(spec, { claim: true });
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /H0 rank is 2/);
    assert.equal(settleChecker(spec, { claim: false }).pass, true);
  });

  test('a genuine cycle: H0 rank 1 (equivalent) but H1 != 0 -- equivalence and obstruction are independent readings', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
      { subject: 'C', predicate: 'equivalent-to', object: 'A' },
    ] };
    const real = cohomologyOfRelation(spec.cells);
    assert.equal(real.H0.rank, 1);
    assert.equal(real.H1.rank, 1);
    // the checker's own claim is only about H0 (equivalence), so claim=true still passes even
    // though the graph has a cycle; connectivity and cycle rank are distinct.
    assert.equal(settleChecker(spec, { claim: true }).pass, true);
  });
});

describe('observeChecker (type E) -- equivo-design.md §5.3', () => {
  test('unmarked record: regime strict, depth 2, H1 vanishes', () => {
    const spec = { stages: [
      { designated: ['a'] }, { designated: ['a', 'b'] }, { designated: ['a', 'b', 'c'] },
    ] };
    const v = settling(spec.stages, {});
    assert.equal(classify(v).depth, 2);
    assert.equal(classify(v).regime, 'strict');
    assert.equal(h1(v).vanishes, true);
    assert.equal(observeChecker(spec, { regime: 'strict', h1Vanishes: true }).pass, true);
    assert.equal(observeChecker(spec, { regime: 'transfinite-bounded', h1Vanishes: false }).pass, false);
  });

  test('two new cells at a marked limit: declared model H1 rank 2', () => {
    const spec = { stages: [
      { designated: ['a'] }, { designated: ['a', 'b'] },
      { designated: ['a', 'b', 'c', 'd'], limit: true },
    ] };
    const v = settling(spec.stages, {});
    const ob = h1(v);
    assert.equal(classify(v).regime, 'transfinite-bounded');
    assert.equal(ob.rank, 2);
    assert.equal(ob.vanishes, false);
    assert.equal(observeChecker(spec, { regime: 'transfinite-bounded', h1Vanishes: false }).pass, true);
  });

  test('scott regime: a limit stage that fires nothing is NOT transfinite -- the naive-expectation trap the capstone lesson names explicitly', () => {
    const spec = { stages: [
      { designated: ['a'] }, { designated: ['a', 'b'] },
      { designated: ['a', 'b'], limit: true },
      { designated: ['a', 'b', 'c'] },
    ] };
    const v = settling(spec.stages, {});
    assert.equal(classify(v).regime, 'scott');
    assert.equal(h1(v).vanishes, true);
    assert.equal(observeChecker(spec, { regime: 'scott', h1Vanishes: true }).pass, true);
    assert.equal(observeChecker(spec, { regime: 'transfinite', h1Vanishes: true }).pass, false);
  });

  test('aperiodic regime requires the declared cofinal opt, not just a limit firing', () => {
    const spec = { stages: [{ designated: ['a'] }, { designated: ['a', 'z'], limit: true }], opts: { cofinal: 'uncountable' } };
    const v = settling(spec.stages, spec.opts);
    assert.equal(classify(v).regime, 'aperiodic');
    assert.equal(observeChecker(spec, { regime: 'aperiodic', h1Vanishes: false }).pass, true);
  });
});

describe('repairChecker (type F) -- implemented, tested, NOT shipped in any corpus content (MVP_KINDS excludes it)', () => {
  test('an edit that closes the obstruction while keeping every entity passes', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
      { subject: 'C', predicate: 'equivalent-to', object: 'A' },
    ] };
    // remove one edge of the triangle but keep all three entities present via the remaining two edges
    const editedCells = [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
    ];
    const v = repairChecker(spec, { cells: editedCells });
    assert.equal(cohomologyOfRelation(editedCells).H1.rank, 0);
    assert.equal(v.pass, true);
  });

  test('the disclosed evasion case: deleting an entity closes H1 but is rejected', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
      { subject: 'C', predicate: 'equivalent-to', object: 'A' },
    ] };
    const editedCells = [{ subject: 'A', predicate: 'equivalent-to', object: 'B' }]; // C dropped entirely
    const v = repairChecker(spec, { cells: editedCells });
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /deleted rather than reconciled/);
  });

  test('an edit that leaves the obstruction unresolved fails', () => {
    const spec = { cells: [
      { subject: 'A', predicate: 'equivalent-to', object: 'B' },
      { subject: 'B', predicate: 'equivalent-to', object: 'C' },
      { subject: 'C', predicate: 'equivalent-to', object: 'A' },
    ] };
    const v = repairChecker(spec, { cells: spec.cells }); // unedited -- still obstructed
    assert.equal(v.pass, false);
    assert.match(v.diagnosis, /still carries an obstruction/);
  });
});

describe('registry wiring', () => {
  test('equivoCheckers registers exactly the six §3 kinds', () => {
    assert.deepEqual(Object.keys(equivoCheckers).sort(), ['distinguish', 'measure', 'observe', 'relate', 'repair', 'settle']);
  });

  test('MVP_KINDS is a strict subset of the full registry and excludes repair', () => {
    for (const k of MVP_KINDS) assert.ok(k in equivoCheckers);
    assert.ok(!MVP_KINDS.includes('repair'));
  });
});
