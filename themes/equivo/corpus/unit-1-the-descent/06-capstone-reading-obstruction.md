---
title: Reading Obstruction
type: lesson
requires:
  - 05-observing-regimes.md
teaches:
  - putting all five stages of the descent together on new scenarios
keywords: ["equivo", "descent", "capstone"]
date-created: 2026-08-20
authors:
  - claude-fable-5
date-updated: 2026-10-04
---

Choose the carrier before calculating its reading:

- A token and claim ask you to distinguish or relate them.
- One witness for a reflexive claim supplies evidence sides `[true, false]`.
- A finite edge list asks for connectivity. The checker calls one component “equivalent”; independent cycles are a separate reading.
- A cumulative stage record asks for the marked-stage model's label and whether its limit-firing count is zero.

A chain on four vertices has one component and no independent cycles. Two disjoint triangles have two components and two independent cycles. Neither result, by itself, judges the truth of a claim attached to those vertices.

For the stage record, visiting a marked limit stage without adding a cell contributes nothing to the limit-firing count. If a later marked limit stage introduces a cell, the count becomes positive. With no uncountable-cofinal declaration, the model labels that case transfinite-bounded. This is a computation on the supplied record, not evidence that an infinite process occurred.

The useful skill is to keep these distinctions when moving between examples. The two readings called H¹ belong to different supplied models; a common name does not make their carriers interchangeable. Completing this unit demonstrates practice with the thirty checks. It is not a certification of mathematical mastery or of real-world alignment.

```equivo-exercise
[
  {
    "kind": "measure",
    "prompt": "A single eyewitness claims the light was red. What charge does this cell settle to?",
    "utterance": ["a single eyewitness", "the light was red"]
  },
  {
    "kind": "settle",
    "prompt": "A-B-C-D in a straight chain, each equivalent to the next. Does this settle to one equivalence class?",
    "cells": [
      { "subject": "A", "predicate": "equivalent-to", "object": "B" },
      { "subject": "B", "predicate": "equivalent-to", "object": "C" },
      { "subject": "C", "predicate": "equivalent-to", "object": "D" }
    ]
  },
  {
    "kind": "settle",
    "prompt": "Two separate triangles: A-B-C cycling back to A, and independently D-E-F cycling back to D. Does this settle to one equivalence class?",
    "cells": [
      { "subject": "A", "predicate": "equivalent-to", "object": "B" },
      { "subject": "B", "predicate": "equivalent-to", "object": "C" },
      { "subject": "C", "predicate": "equivalent-to", "object": "A" },
      { "subject": "D", "predicate": "equivalent-to", "object": "E" },
      { "subject": "E", "predicate": "equivalent-to", "object": "F" },
      { "subject": "F", "predicate": "equivalent-to", "object": "D" }
    ]
  },
  {
    "kind": "observe",
    "prompt": "Four ordinary successor stages, no limit anywhere: {a}, {a,b}, {a,b,c}, {a,b,c,d}. What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "b"] },
      { "designated": ["a", "b", "c"] },
      { "designated": ["a", "b", "c", "d"] }
    ]
  },
  {
    "kind": "observe",
    "prompt": "A settling reaches a limit stage where nothing fires, takes one more ordinary step, then fires something new at a SECOND limit stage: {a}, {a,b}, {a,b} (limit, nothing new), {a,b,c}, {a,b,c,d} (limit, d is new). What regime, and does H1 vanish?",
    "stages": [
      { "designated": ["a"] },
      { "designated": ["a", "b"] },
      { "designated": ["a", "b"], "limit": true },
      { "designated": ["a", "b", "c"] },
      { "designated": ["a", "b", "c", "d"], "limit": true }
    ]
  }
]
```
