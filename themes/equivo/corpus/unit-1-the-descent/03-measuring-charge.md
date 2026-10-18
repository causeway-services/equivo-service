---
title: Measuring Charge
type: lesson
requires:
  - 02-relating-cells.md
teaches:
  - assigning a FOUR-value bilattice charge from evidence
keywords: ["equivo", "descent", "measure"]
date-created: 2026-08-20
authors:
  - claude-fable-5
date-updated: 2026-10-04
---

A related cell carries evidence on two independent sides: evidence **for** its claim and evidence **against** it. Read whether each side is nonempty. The answer is `[for, against]`.

| Software name | For | Against | Evidence reading |
|---|---|---|---|
| **absurd** | false | false | neither side is told |
| **potential** | true | false | only the claim is supported |
| **active** | false | true | only the claim's denial is supported |
| **stable** | true | true | both sides are supported |

The names come from the software's knowledge reading; they are not ordinary-language judgments. In particular, **stable** here names conflicting evidence on both sides, not verified truth. The standard logical names for the same points are neither, true, false, and both. Truth and knowledge are orders on the four points, not the two checkbox coordinates.

Each exercise constructs one reflexive cell with one supplied witness **for** the claim and no witness against it. No inference or transport rule adds evidence, so its fixed point is already `[true, false]`. A second supporting witness would still leave the same two-bit reading: the bits record presence, not confidence or a witness count. Independent confirmation is not the second bit.

A bridge-safety assertion in an exercise is only an assertion in this model. Measuring its evidence sides does not inspect a bridge or establish that assertion's truth. Predict the carrier the exercise actually supplies.

```equivo-exercise
[
  {
    "kind": "measure",
    "prompt": "A single sensor reading claims the bridge is structurally sound. What charge does this cell settle to — as a [for, against] pair?",
    "utterance": ["a single sensor reading", "the bridge is structurally sound"]
  },
  {
    "kind": "measure",
    "prompt": "One favorable review claims the paper is correct. What charge does this cell settle to?",
    "utterance": ["one favorable review", "the paper is correct"]
  },
  {
    "kind": "measure",
    "prompt": "A rumor claims the merger is happening. What charge does this cell settle to?",
    "utterance": ["a rumor", "the merger is happening"]
  },
  {
    "kind": "measure",
    "prompt": "A single data point claims the trend is real. What charge does this cell settle to?",
    "utterance": ["a single data point", "the trend is real"]
  }
]
```

```equivo-exercise
{
  "kind": "relate",
  "prompt": "Review: a soil sample is taken, asserting the field was flooded last spring. Relate it into its cell -- entities and predicates?",
  "utterance": ["a soil sample", "the field was flooded last spring"]
}
```
