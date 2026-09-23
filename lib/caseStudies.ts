export type CaseStudySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  repo: string;
  demo?: string;
  stack: string[];
  diagram: 'task-scheduler' | 'ai-code-reviewer';
  problem: string[];
  architectureNote: string[];
  keyDecisions: { title: string; body: string }[];
  failureScenarios: { title: string; body: string }[];
  testing: string[];
  observability: string[];
  deployment: string[];
  limitations: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  'task-scheduler': {
    slug: 'task-scheduler',
    title: 'Distributed Task Scheduler',
    tagline: 'Background jobs that run reliably across multiple workers, built the way AWS SQS or Google Cloud Tasks work.',
    repo: 'https://github.com/PubuduGunasekara/distributed-task-scheduler',
    stack: ['Java 21', 'Spring Boot 3.5', 'Apache Kafka', 'Redis', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana', 'JUnit', 'Testcontainers', 'GitHub Actions'],
    diagram: 'task-scheduler',
    problem: [
      'Some work shouldn’t block a request while it runs — sending thousands of emails, generating a report, processing an upload. That work needs to go to a background job that a separate pool of workers can pick up.',
      'Doing that reliably is harder than it sounds. Workers crash mid-job. Kafka’s at-least-once delivery means the same job event can arrive twice. A slow downstream call needs to be retried without hammering it. And a job that fails silently is worse than one that fails loudly.',
    ],
    architectureNote: [
      'A request hits the REST API behind a Redis-backed rate limiter, gets saved to PostgreSQL, and an event is published to Kafka. Worker instances — all running the same Spring Boot service, joined to the same Kafka consumer group — consume events, acquire a Redis lock, run the task, and update PostgreSQL. A retry scheduler polls for eligible failures and re-publishes them with backoff; exhausted tasks move to a dead-letter queue. A separate stale-task recovery sweep catches jobs a crashed worker never finished. Prometheus scrapes metrics from every component; Grafana visualizes them.',
      'This runs as one Spring Boot service, not a set of separate services — a modular monolith organized internally with hexagonal (ports-and-adapters) architecture. Worker throughput scales horizontally by running more instances of that same service; there’s no separate "worker" deployment.',
    ],
    keyDecisions: [
      {
        title: 'Duplicate execution, stopped three different ways',
        body: 'Kafka guarantees at-least-once delivery, so a redelivered or duplicate event is an expected case, not an edge case. A Redis lock (SETNX with a 30s TTL) lets only one worker touch a task at a time, and is released with a small Lua script that does an atomic compare-and-delete — so a worker can never release a lock it doesn’t own, which a plain GET-then-DEL would risk. Underneath that, a database state machine only allows a task to start once. And underneath that, JPA optimistic locking (@Version) makes two simultaneous writes to the same task row fail safely instead of silently overwriting each other. No single layer is trusted alone.',
      },
      {
        title: 'Backoff instead of hammering, and a real dead-letter path',
        body: 'A failed task is retried with exponential backoff — 10s, then 30s, then 90s (delay = 10 × 3^(retryCount-1)) — giving a transient failure (a network blip, a downstream restart) time to clear instead of retrying instantly. With the default of 3 retries, that’s an initial attempt plus three more; the fourth failure marks the task DEAD_LETTER in PostgreSQL and publishes it to a dedicated task-dlq Kafka topic for manual inspection, instead of dropping it silently.',
      },
      {
        title: 'Recovering from a crashed worker',
        body: 'If a worker dies mid-task, the task would otherwise sit stuck forever — its Redis lock eventually expires, but nothing else notices on its own. A background scheduler polls (every 60s, by default) for tasks stuck RUNNING past an execution timeout (5 minutes, by default) and fails them through the same retry path as any other failure. Separately, it re-publishes PENDING tasks whose creation event appears to have been lost. Multiple app instances can run this sweep at once safely — a lost race is just a database exception that gets logged and skipped, because the state machine and optimistic locking are the real guards, not the scheduling.',
      },
      {
        title: 'A boundary the build enforces, not just documents',
        body: 'The domain layer (entities, services, ports) depends on nothing external — no Spring, no Kafka client, no Redis client. Infrastructure adapters (Redis, Kafka, metrics) implement domain-defined ports. An ArchUnit test fails the build if that boundary is ever crossed, so the architecture can’t quietly rot as the codebase grows.',
      },
    ],
    failureScenarios: [
      {
        title: 'Two workers consume the same redelivered event',
        body: 'Only one acquires the Redis SETNX lock; the other finds it already held and moves on without touching the task. If the lock had somehow already expired and both got through, the database state machine and the @Version optimistic lock still prevent a double-run — a second UPDATE against a stale version fails instead of corrupting state.',
      },
      {
        title: 'A worker crashes while legitimately still running a long task',
        body: 'This is the sharpest real trade-off in the system: the recovery sweep’s execution timeout (5 minutes, by default) has to be longer than the Redis lock TTL (30s) to avoid immediately re-queuing a task the lock just hasn’t confirmed yet — but if a task genuinely takes longer than that timeout, the sweep can mark it failed and retry it while the original worker is still legitimately working. The state machine still prevents any data corruption, but the original worker’s eventual result is silently discarded. The fix is operational, not architectural: set the timeout well above the slowest expected task type. A lease-renewal or fencing-token mechanism would close this properly and is the top item in the project’s own known-limitations list.',
      },
      {
        title: 'Retries are exhausted',
        body: 'The fourth failure (initial attempt + 3 retries) moves the task to DEAD_LETTER and publishes it to the task-dlq Kafka topic — a durable, inspectable trail instead of a task that just disappears.',
      },
    ],
    testing: [
      '164 @Test methods across unit tests and integration tests that run against real PostgreSQL and Redis via Testcontainers, not mocks — so the Redis lock script and the database state machine are exercised against the real thing.',
      'An ArchUnit test enforces the hexagonal boundary at build time.',
      'CI runs the full suite through Maven’s verify goal with a JaCoCo coverage gate set at 80% line and 80% branch; the project’s own README reports the current run at 94.6% line / 90.0% branch.',
    ],
    observability: [
      'Every component — the API, the workers, the retry scheduler, the recovery sweep — reports metrics through Micrometer to Prometheus.',
      'Grafana dashboards (provisioned in the repo under docker/grafana) visualize them, so the state of the system is something you can look at, not just infer from logs.',
    ],
    deployment: [
      'A multi-stage Dockerfile builds a slim runtime image. docker-compose brings up PostgreSQL, Redis, Kafka, Prometheus, and Grafana together for local development.',
      'CI (GitHub Actions) runs as two jobs: the first builds, tests, and enforces the coverage gate against a real Postgres service container; the second — gated on the first passing — builds a multi-platform (amd64/arm64) Docker image with Buildx and pushes it to the GitHub Container Registry on pushes to main.',
    ],
    limitations: [
      'Fixed lock TTL, no lease renewal or fencing tokens — a job whose real runtime exceeds the recovery scheduler’s execution timeout (default 5 minutes) can be marked failed while the original worker is still legitimately running it. The state machine prevents any corruption, but the worker’s real outcome is silently discarded rather than surfaced. Set the timeout well above the slowest expected job type.',
      'At-least-once delivery end to end (Kafka redelivery, orphan re-publishing, retry re-queuing) — job executors with external side effects must be idempotent; the scheduler doesn’t deduplicate at the business-logic level.',
      'Retries and recovery are both polling-based — actual retry delay is backoff plus up to one 30-second poll interval, and a stuck job can sit for up to one recovery-scheduler poll interval (default 60s) past its timeout before being noticed.',
      'No leader election for the recovery scheduler — every app instance runs it independently, which is safe (optimistic locking and the state machine are the real guards, not scheduling) but means redundant recovery attempts under multiple instances.',
      'A single poll cycle caps how many stale jobs it processes (100 by default) — a larger backlog clears over several cycles, not immediately.',
    ],
  },
  'ai-code-reviewer': {
    slug: 'ai-code-reviewer',
    title: 'AI Code Review Assistant',
    tagline: 'Sign in with GitHub, pick an open pull request, and get an instant first-pass review with severity-tagged findings.',
    repo: 'https://github.com/PubuduGunasekara/ai-code-reviewer',
    demo: 'https://main.d3dm91k4g9mtr9.amplifyapp.com/',
    stack: ['Node.js', 'Express 5', 'React 19', 'Vite', 'OpenAI gpt-4o-mini', 'Redis', 'PostgreSQL', 'Passport (GitHub OAuth)', 'Octokit', 'Docker'],
    diagram: 'ai-code-reviewer',
    problem: [
      'Code review is one of the slowest steps in shipping software — pull requests often sit for a day or more before a human looks at them.',
      'This app gives a first-pass review in seconds: sign in with GitHub, pick one of your open pull requests, and the app reads the diff and returns a structured review — each finding tagged with a severity and category, an explanation, and where possible a suggested fix — so a human reviewer can spend their time on the harder judgment calls instead of the obvious ones.',
    ],
    architectureNote: [
      'The React/Vite frontend (hosted on AWS Amplify) signs the user in through GitHub OAuth and talks to an Express API (on AWS EC2). The API pulls the user’s repositories and pull requests through the GitHub API via Octokit, fetches the diff for the chosen PR, and sends it to gpt-4o-mini with a prompt that specifies the exact JSON shape to return. Sessions and review history are stored in PostgreSQL; Redis handles the review-result cache and per-user rate limiting. The reviewed result flows back to the frontend as severity-tagged findings.',
      'The interesting engineering here is less about the model call itself and more about building a dependable product around it: handling large diffs, protecting an expensive endpoint from abuse, caching to avoid re-paying for identical work, and treating the model’s output as untrusted input to validate, not a black box to trust.',
    ],
    keyDecisions: [
      {
        title: 'GitHub OAuth and PR selection',
        body: 'Login goes through GitHub OAuth (Passport), requesting repo scope so the app can read pull request diffs on the user’s behalf. Sessions are stored server-side in PostgreSQL via connect-pg-simple, so a login survives a server restart instead of forcing a re-auth. Picking a PR fetches its metadata and raw diff from GitHub through Octokit, parses the diff into per-file changes, and stores it as a pending review row before any AI call happens.',
      },
      {
        title: 'Large diffs get trimmed, not rejected',
        body: 'gpt-4o-mini has a real context limit. Diffs are capped at 100,000 characters (roughly a 4-characters-per-token estimate, leaving headroom for the response) — a diff over that limit is truncated with an explicit "[DIFF TRUNCATED]" marker appended, so an oversized PR still gets a partial, clearly-labeled review instead of a hard failure.',
      },
      {
        title: 'A JSON contract, enforced defensively rather than assumed',
        body: 'The system prompt spells out an exact JSON shape — severity levels (critical through info), fixed categories (security, performance, bug, error-handling, style, architecture), and required fields — and the request uses OpenAI’s response_format: { type: "json_object" } mode, which guarantees syntactically valid JSON. That’s a real but honest distinction worth being precise about: this is not OpenAI’s strict json_schema structured-output mode with enum-constrained fields — it’s a prompt-specified contract. So the server never trusts it blindly: a response that fails to parse as JSON throws an explicit error instead of corrupting stored data, and a response that parses but is missing or malformed fields (no issues array, an out-of-range score, no summary) gets defensive defaults applied before anything is persisted.',
      },
      {
        title: 'Rate limiting that fails open, and a cache that saves real money',
        body: 'The review endpoint is the expensive one (it pays for an OpenAI call), so it’s rate limited per user — an atomic Redis INCR against a rate:review:<userId> key, with a 1-hour expiry set only on the first request of the window, capped at 10 reviews/hour. Standard X-RateLimit-Limit / -Remaining / -Reset headers are returned either way. If Redis errors, the limiter deliberately fails open (allows the request through) rather than failing closed — a documented choice that a broken cache shouldn’t be able to take the whole product down. Review results are separately cached in Redis for an hour, keyed by a SHA-256 hash of the diff content, so re-opening the same PR is instant and doesn’t re-pay the OpenAI cost. PostgreSQL is the durable store underneath — the reviews and review_comments tables back the paginated review-history UI and outlive the cache.',
      },
    ],
    failureScenarios: [
      {
        title: 'The model returns text that isn’t valid JSON',
        body: 'JSON.parse throws, the raw response is logged for debugging, and the request fails with an explicit "AI returned invalid response format" error rather than silently storing garbage.',
      },
      {
        title: 'The model returns valid JSON in the wrong shape',
        body: 'json_object mode guarantees syntax, not content — a missing issues array, an out-of-range score, or a missing summary all get replaced with safe defaults (an empty list, a score of 5, a fallback summary string) before the review is saved, so a slightly-off model response degrades gracefully instead of breaking the UI.',
      },
      {
        title: 'Redis is briefly unavailable',
        body: 'Rate limiting fails open — reviews keep working, just unmetered until Redis recovers. Cache reads simply miss, so every review falls through to a real (paid) OpenAI call during the outage — a deliberate availability-over-cost trade-off, not a crash.',
      },
      {
        title: 'Two requests to process the same review land close together',
        body: 'The handler checks the review’s status and only proceeds if it isn’t already \'processing\' or \'completed\', returning 409 otherwise — but that check and the status update that follows it are separate database queries, not one atomic operation. In practice this makes a double OpenAI call for the same review unlikely, not provably impossible under true concurrency. Worth listing honestly as a known gap rather than a solved problem.',
      },
    ],
    testing: [
      'There is no automated test suite in this repository at the time of writing — no test runner is configured and no test files exist beyond a deliberately-vulnerable sample route used to demo the reviewer catching real issues. This is a genuine gap, not a soft-pedaled one.',
    ],
    observability: [
      'Observability today is request-level logging — PR fetch/processing timing, cache hit/miss, and OpenAI response timing are logged to the console — plus a GET /health endpoint for basic liveness checks. There’s no metrics/dashboard layer here the way the Task Scheduler has Prometheus and Grafana; that’s a reasonable gap for a smaller single-service app but a real difference worth naming rather than glossing over.',
    ],
    deployment: [
      'Packaged with Docker and Docker Compose (which brings up local PostgreSQL and Redis for development). Per the project README, the frontend is deployed on AWS Amplify and the backend API on AWS EC2.',
      'There is no CI/CD pipeline configured in this repository (no GitHub Actions workflow) — build and deploy are currently manual.',
    ],
    limitations: [
      'Uses OpenAI’s JSON-object response mode plus a prompt-specified shape and defensive server-side coercion, not schema-enforced structured output — a valid-JSON-but-wrong-shape response is caught by defaults, but the contract isn’t enforced by the model provider itself.',
      'Rate limiting fails open when Redis is unavailable, trading strict quota enforcement for availability.',
      'The "already processing" guard reads and writes review status as separate queries rather than one atomic operation, so two near-simultaneous requests for the same review aren’t provably prevented from both reaching OpenAI.',
      'No automated test suite or CI pipeline yet.',
      'No metrics/dashboard observability beyond request logging and a health endpoint.',
    ],
  },
};
