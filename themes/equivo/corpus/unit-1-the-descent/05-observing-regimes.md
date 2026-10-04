---
title: Observing Regimes
type: lesson
requires:
  - 04-settling-equivalence.md
teaches:
  - classifying a settling's regime and reading whether its H1 vanishes
keywords: ["equivo", "descent", "observe"]
date-created: 2026-08-20
authors:
  - claude-fable-5
date-updated: 2026-10-04
---

This lesson changes carriers. It supplies a **finite, marked stage record**, not the graph from Settling Equivalence. Each stage contains a cumulative set of designated cells. Designations cannot disappear. A `limit` marker is supplied as data; the browser does not run an infinite ordinal sequence to discover it.

For each stage, subtract all previously designated cells to find the new ones. The model counts new cells at marked limit stages and names that count its **H¹ rank**. This is the repository's defined marked-stage reading; the course establishes no equivalence between it and the graph cohomology of the previous lesson.

## Predict the model's labels

- **strict:** the record contains no marked limit stage.
- **scott:** there are marked limit stages, but none introduces a new cell.
- **transfinite-bounded:** at least one new cell appears at a marked limit stage, without the uncountable-cofinal declaration.
- **aperiodic:** such a firing is present and the input also declares `cofinal: "uncountable"`.

The first two cases have rank zero; the last two have positive rank. Two new cells at the same marked limit stage contribute two to the count. The software's depth is its bounded reading of the last firing and the supplied markers.

A finite record and a declaration do not prove uncountable cofinality, nonstabilization, mathematical Scott continuity, or physical aperiodicity. These exercise answers name cases of this particular classifier. Use the names with their carrier attached, and require additional evidence before applying them to an actual process.

```equivo-exercise
[
  {
    "kind": "observe",
    "prompt": "A settling adds one cell per stage with no limit stage at all: {a}, {a,b}, {a,b,c}. What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "b"] },
      { "designated": ["a", "b", "c"] }
    ]
  },
  {
    "kind": "observe",
    "prompt": "A settling reaches a limit stage where nothing new fires (everything was already there), then one more successor stage adds a cell: {a}, {a,b}, {a,b} (limit), {a,b,c}. What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "b"] },
      { "designated": ["a", "b"], "limit": true },
      { "designated": ["a", "b", "c"] }
    ]
  },
  {
    "kind": "observe",
    "prompt": "A settling's very next stage is a limit stage, and a new cell fires exactly there: {a}, then {a,c} (limit). What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "c"], "limit": true }
    ]
  },
  {
    "kind": "observe",
    "prompt": "A settling grows normally, then TWO new cells fire simultaneously at a limit stage: {a}, {a,b}, {a,b,c,d} (limit, c and d both first appear here). What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "b"] },
      { "designated": ["a", "b", "c", "d"], "limit": true }
    ]
  },
  {
    "kind": "observe",
    "prompt": "A settling is explicitly declared to keep firing cofinally through an uncountable sequence of limit stages -- {a}, then {a,z} (limit), never stabilizing. What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "z"], "limit": true }
    ],
    "opts": { "cofinal": "uncountable" }
  }
]
```

```equivo-exercise
{
  "kind": "settle",
  "prompt": "Review: P relates to Q, and separately R relates to S. Does this settle to one equivalence class?",
  "cells": [
    { "subject": "P", "predicate": "equivalent-to", "object": "Q" },
    { "subject": "R", "predicate": "equivalent-to", "object": "S" }
  ]
}
```
