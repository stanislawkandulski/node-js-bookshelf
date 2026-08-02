# Context: Node.js learning project (Teamleader exam prep)

## Who I am

Learning Node.js to become a **junior full-stack developer at Teamleader**
(Belgian CRM SaaS). Coding exam at the end of **September 2026** —
**confirmed by Teamleader to be Node/JS-based**. (Teamleader's *public*
`teamleadercrm/coding-test` repo is PHP — that's just an example of their
grading style, not the actual exam. Don't rebalance toward PHP based on it.)

Starting point: JS basics, comfortable with `async/await`. No prior backend,
database, or React experience.

## How I want to be taught

- **Give me milestones, not solutions.** Describe what to build and why. Let
  me write the code. Hand over a starting snippet only when the alternative
  is me stuck on pure boilerplate.
- **Prescribe experiments that break things.** "Remove the `await` and see
  what happens" teaches more than explanation. Do this often.
- **Explain the *why*, not just the *what*.**
- **Push back on me, and expect me to push back on you.**
- **Correct my reasoning even when my conclusion is right.**
- **Flag the bug that looks like correct behaviour.**
- Don't pad with praise. Get to the substance.
- I write the code myself — act as reviewer/guide. Only edit files directly
  when I explicitly say "fix it."

## The grading rubric — apply this to everything I write

| Criterion | In practice |
|---|---|
| Atomic commits | Small, self-contained commits with clear messages. Git history should read as a development story. |
| Domain modelling | Code structured around the problem domain, not technical layers. |
| Value objects | No raw primitives with hidden rules. `Money`, `Email`, `BookId` are types. |
| Exception handling | Custom error classes, meaningful messages, nothing silently swallowed. |
| Unit test coverage | Critical logic tested. Not 100% — the important parts. |
| Readable README | Setup, how to run, how to test, plus a short "design decisions" section. |

Working code is the floor, not the goal. The question is always: would this
pass code review at a company that values maintainability?

## Target stack (Teamleader)

- Frontend: **React + TypeScript**, Jest, Storybook, ESLint, Prettier
- Their public JS SDK: `github.com/teamleadercrm/sdk-js`
- Their API is **RPC-style**: `resource.action` over POST, OAuth2, responses
  keyed by `data`, errors as an array, `include` for sideloading
- Database: MySQL. Infra: Docker, Kubernetes

## Current state (as of 2026-08-02)

- Stage 1 (bookshelf CLI) is functionally done: reads/writes JSON via
  `node:fs/promises`, `--addBook` flag parses `process.argv`. Already written
  in TypeScript (`index.ts`, `tsconfig.json`) — no JS-to-TS conversion left
  to do.
- **No git repo yet** — needs `git init` before Stage 2 work continues.
- Dead code: lines ~93–123 of `index.ts` are commented-out aggregation
  exercises (count/filter/reduce), never wired into a runnable command —
  needs to be wired up or deleted.
- `books.json` has a stray leftover object to clean up.
- No README yet.
- Stage 2 (REST API) not started: no `node:http`, no Hono, no Vitest, no
  custom error classes.

## Milestones (flexible dates — see full plan for checkpoint conditions)

Full roadmap: `~/.claude/plans/context-node-js-learning-sprightly-quasar.md`

- **M0 — Foundation cleanup** *(target: by Aug 8)*: git init + first commits,
  resolve dead aggregation code, clean `books.json`, README stub.
- **M1 — Stage 2: REST API foundation** *(~Aug 17)*: raw `node:http` → Hono
  routing, custom error classes + central error handling, Vitest, JSON
  persistence, PUT vs PATCH.
- **M2 — TS hardening + first value object** *(~Aug 24)*: strict `tsconfig`
  audit, `tsc --noEmit` in the loop, Zod validation, `Money` value object.
- **M3 — SQL + persistence layer** *(~Aug 31)*: SQLite, Drizzle ORM,
  repository pattern.
- **M4 — Craft week** *(~Sep 7)*: domain/application/infrastructure layers,
  test doubles, integration tests, discount exercise rehearsal in TS.
  Checkpoint: not done by here → cut frontend scope.
- **M5 — React + TS frontend** *(~Sep 12)*: Vite, loading/error states.
- **M6 — Auth + RPC style** *(~Sep 18)*: CORS, argon2, sessions vs JWT,
  OAuth2, one endpoint in Teamleader's RPC style. Checkpoint: behind here →
  drop Docker (M7) before dropping the mock exam (M8).
- **M7 — Tooling + deploy** *(~Sep 23)*: ESLint/Prettier, Docker Compose
  (app + Postgres), GitHub Actions.
- **M8 — Mock exam** *(last week of Sep)*: unseen problem, full build,
  reviewed against the rubric above.

Deliberately skipped: Next.js, event sourcing/CQRS, GraphQL, microservices,
Kubernetes, Redis internals, LeetCode-style algorithms.

## The discount exercise (M4 rehearsal)

From Teamleader's public PHP coding test, rebuilt in TypeScript. Three rules
over an order of products:

1. Customer who has already bought > €1000 → 10% off the whole order
2. Buy 5 of category "Switches" (id 2) → cheapest one free
3. Buy 2+ of category "Tools" (id 1) → 20% off the cheapest

More discount types may be added later — wants a `DiscountRule` interface,
one class per rule, open/closed principle. Full test coverage, atomic
commits, `Money` value object.

## Notes

- Node 24 LTS. ESM (`"type": "module"`). Node runs `.ts` files natively via
  type stripping — no build step, but it does not type-check, so
  `tsc --noEmit` separately.
- Exam format (take-home vs timed) still unconfirmed.
