# Context for reviewing my Node.js learning plan

I'm a QA engineer (Playwright/TypeScript background) preparing for an
internal coding exam for a junior full-stack developer role. The exam is
confirmed to be Node.js/TypeScript-based, scheduled for end of September
2026. I'm using a personal side project to build up backend skills before
then. I'd like an honest, critical outside opinion — please don't just
validate my plan, actively look for gaps, wrong sequencing, or wasted
effort.

## What I've actually built so far

A small CLI "bookshelf" app in TypeScript, ESM, Node 24, strict tsconfig
(noUncheckedIndexedAccess, exactOptionalPropertyTypes). Concretely it:
- reads/writes a JSON file via `node:fs/promises` (and one inconsistent
  callback-style `fs.writeFile` I haven't fixed yet)
- parses CLI flags manually from `process.argv`
- has one TypeScript `interface` for the domain object, no classes
- wraps errors with `new Error(msg, { cause })`, no custom error classes
- has zero automated tests, zero lint/format config, one commit (no commit
  history/discipline yet)
- a separate one-off file demonstrates basic event-loop ordering
  (`setTimeout` vs synchronous logs)

That's the entire skill surface right now: async/await basics, one
strict-typed interface, file I/O, ad-hoc error wrapping, manual CLI parsing.
No HTTP server, no framework, no validation library, no database, no OOP,
no tests.

## What "real" Node.js looks like at my company (generalized, no internal names)

I looked across several production TypeScript/Node services at my company
to see what experienced engineers actually build with. Patterns I found,
described generically:

- **A typical backend service**: Express-style HTTP framework, routes
  grouped by feature, each route chaining an auth middleware and a
  schema-validation middleware (Zod) before the handler. Schemas are
  defined once per route and the TypeScript type is inferred from the
  schema (single source of truth for validation + typing).
- **Two different persistence approaches** show up side by side in one
  service: a document-style store accessed via an AWS-style SDK with
  manual query building, and a relational store accessed through a
  lightweight TypeScript ORM with a proper repository-style data layer and
  schema migrations.
- **A class-based plugin/strategy pattern**: an abstract base class
  implements a shared interface and holds common state/setup; several
  concrete subclasses each override one lifecycle method to do a distinct
  side effect (write to storage, call an external API, insert into a
  database, notify a channel). Which subclasses actually run is decided
  entirely by an environment variable at startup, mapped through a
  string-keyed config object — behavior composed at runtime, not compile
  time.
- **A small CLI/build-tool style service**, by contrast, has no framework
  or classes at all: a linear script pipeline of plain async functions,
  synchronous file I/O, shelling out to an external CLI tool via
  `child_process`, and a typed config module that derives paths/URLs from
  environment variables once.
- **Another small backend job** (a scheduled batch/cron-style service) is
  pure ESM with top-level `await`, no classes, just exported async
  functions per concern (DB access, file generation, external API call)
  composed in a thin `main()`, plus real unit tests (Vitest) on the pure
  logic only — I/O is deliberately kept out of the unit-tested layer.
- Consistent threads across all of them: environment-variable-driven
  configuration (sometimes centralized behind small typed getters, not
  scattered `process.env` calls), async/await as the default async style,
  strict TypeScript configs, and — notably — **none of these production
  services have much automated test coverage themselves**, even ones whose
  whole job is managing/reporting on tests.
- CI/CD is entirely separate reusable YAML pipelines (no custom Node
  scripts in the CI layer itself) — dependency bumps, lint, type-check,
  and test are standardized steps injected via shared workflow config, not
  hand-rolled per project.

## My current milestone roadmap (self-authored, dates are soft checkpoints not deadlines)

- **M0** (foundation cleanup): real git history/atomic commits, remove dead
  code, fix a malformed JSON fixture, start a README.
- **M1** (REST API foundation): raw `node:http` first, then a minimal
  framework (routing, params, status codes, request bodies); custom error
  classes + central error handling; first unit tests; JSON persistence.
- **M2** (TS hardening + value object): audit strict compiler settings with
  real type-checking (not just "it runs"); input validation library on API
  inputs; first value object (e.g. a `Money` type using integer cents).
- **M3** (SQL persistence): SQLite locally, a lightweight TS ORM, repository
  pattern so routes never touch the DB directly.
- **M4** (craft week): domain/application/infrastructure layering, test
  doubles, integration tests; rebuild a known three-rule discount-pricing
  exercise (open/closed principle, value objects, full test coverage,
  atomic commits) as exam rehearsal — this is the checkpoint I care most
  about hitting.
- **M5** (frontend): a React + TypeScript frontend (Vite) against the API,
  loading/error states.
- **M6** (auth + API style): CORS, auth (password hashing, sessions vs
  JWT, OAuth2 concepts), and one endpoint built in my company's specific
  RPC-over-POST API convention (single action string, `data`-keyed
  responses, errors as an array, opt-in relation sideloading).
- **M7** (tooling/deploy): lint/format config, Docker Compose (app + DB),
  CI pipeline.
- **M8** (mock exam): a timed/unseen build exercise, graded against: atomic
  commits, domain modelling (not just technical layers), value objects
  instead of raw primitives, custom exception classes, meaningful (not
  100%) test coverage, and a clear README with setup/run/design-decision
  notes.

Explicitly out of scope by choice: Next.js, event sourcing/CQRS, GraphQL,
microservices, Kubernetes, Redis internals, algorithm-heavy exercises.

## What I've found about the current (2026) hiring-task landscape

I did some outside research (not company-specific — general industry
sources) on how Node.js/TypeScript hiring tasks and interviews are actually
run right now, since my own exam format (take-home vs. timed/live) isn't
confirmed yet. Findings worth factoring in:

- **Format is shifting away from long unsupervised take-homes.** Multiple
  2026 sources argue take-homes should be capped under ~90 minutes of
  expected effort or candidates drop out, and some hiring guides go further,
  arguing take-homes test the wrong thing entirely (isolated coding vs. real
  collaboration) and should be replaced or paired with a follow-up
  conversation where the candidate explains their decisions. Practical
  implication: my submission may be judged as much on how well I can *talk
  through* my design choices afterward as on the artifact itself — a README
  "design decisions" section and being able to defend trade-offs out loud
  both matter more than raw completeness.
- **AI tool usage is inconsistent and rules-dependent.** Live/proctored
  rounds increasingly default to AI-assistance *off*, with platforms adding
  explicit "AI-off" modes — assume it's banned unless told otherwise. Many
  take-homes now *do* allow AI tools, with the evaluated skill shifting from
  "can you produce code" to "can you judge code" — i.e., knowing when to
  trust, verify, or override AI-generated output. I should ask directly what
  Teamleader's policy is rather than assume either way.
- **Technical depth expected beyond "it works":** solid explanations of the
  event loop (phases, `process.nextTick` vs `setImmediate`, non-blocking
  I/O), the difference between sync errors (caught automatically) and async
  errors (must be passed via `next(err)` or handled explicitly), and
  centralized error-handling middleware in Express-style frameworks. Framework
  familiarity alone isn't enough — interviewers probe for the "why" under
  the framework, not just correct usage.
- **API design specifics that come up repeatedly:** resource-oriented
  naming over verb-in-path endpoints, correct/consistent HTTP status codes
  and error response shape, pagination/versioning awareness, and
  **idempotency** — especially for POST/create endpoints (avoiding
  duplicate-processing on retries, not using predictable/sequential
  idempotency keys). This is directly relevant since Teamleader's actual API
  convention is RPC-style (`resource.action` over POST for everything,
  including reads) — worth explicitly practicing idempotent POST handling
  rather than assuming plain REST semantics transfer directly.
- **TypeScript strict-mode expectations:** `strictNullChecks` and
  `noImplicitAny` are treated as the two flags that matter most in practice;
  the expected pattern for external data is to type API responses as
  `unknown` at the boundary, validate with a schema, then map into a
  stricter internal domain type — rather than reaching for `any` or trusting
  the transport shape directly. This lines up with (and validates) my
  planned M2 Zod-plus-value-object approach rather than suggesting a
  different one.
- **Security and dependency-hygiene basics that recur:** parameterized
  queries/ORM usage to avoid injection, bcrypt/argon2 password hashing, rate
  limiting, conservative CORS config, and — a newer 2026-specific point —
  basic npm supply-chain awareness (commit the lockfile, be suspicious of
  unexpected dependency version changes, prefer packages with provenance).
- **General take-home/interview evaluation rubrics** in the wild converge on
  a small set of criteria: correctness, code clarity/readability, whether
  edge cases were tested, and quality of problem-solving approach — closely
  overlapping with my own six-criterion rubric already, which is a useful
  cross-check rather than a reason to add more criteria.

## What I want from you

Be genuinely critical, not encouraging-by-default:
1. Given where I actually am (see "what I've built so far"), is this
   roadmap realistically paced for an end-of-September deadline? Where is
   it over-scoped or under-scoped?
2. Is the milestone *order* right, or would you sequence differently (e.g.
   is testing/error-handling too late, is the ORM/SQL step introduced
   before it's needed, is frontend work a distraction from the rubric)?
3. Given the real-world patterns above, what am I *not* planning to learn
   that experienced engineers clearly rely on day-to-day, and does it
   matter for a junior-level exam?
4. Is anything in my roadmap cargo-culted or over-engineered for a junior
   exam (e.g. domain/application/infrastructure layering, value objects
   for everything) versus genuinely worth the time?
5. What would you cut first if I fall behind, and does that match my own
   stated fallback order (drop Docker/CI before dropping the mock exam;
   drop frontend polish before dropping the domain-modelling exercise)?
6. Given that the exam format (take-home vs. timed/live) isn't confirmed
   yet, and given the 2026 trends above (short take-homes, possible
   AI-tool allowances, submissions used as conversation-starters), should I
   change how I prepare — e.g. practice explaining my code out loud, rehearse
   under a tight time box instead of only polishing at leisure, or explicitly
   ask Teamleader about format/AI policy before investing more time?
7. Where in my current plan am I most likely to be able to produce working
   code without being able to explain *why* it works (event loop behavior,
   idempotency, strict-mode type reasoning) — and is that a gap worth
   closing deliberately rather than letting it surface for the first time
   during the actual exam?
