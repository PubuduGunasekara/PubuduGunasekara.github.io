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
  whyComponents?: { title: string; body: string }[];
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
      'Some work should not block a request while it runs. Sending thousands of emails, generating a report, or processing an upload all need to go to a background job that a separate pool of workers can pick up.',
      'Doing that reliably is harder than it sounds. Workers crash mid-job. Kafka’s at-least-once delivery means the same job event can arrive twice. A slow downstream call needs to be retried without hammering it. And a job that fails silently is worse than one that fails loudly.',
    ],
    architectureNote: [
      'A request hits the REST API behind a Redis-backed rate limiter, gets saved to PostgreSQL, and an event is published to Kafka. Worker instances (all running the same Spring Boot service, joined to the same Kafka consumer group) consume events, acquire a Redis lock, run the task, and update PostgreSQL. A retry scheduler polls for eligible failures and re-publishes them with backoff; exhausted tasks move to a dead-letter queue. A separate stale-task recovery sweep catches jobs a crashed worker never finished. Prometheus scrapes metrics from every component, and Grafana visualizes them.',
      'This runs as one Spring Boot service, not a set of separate services. It is a modular monolith organized internally with hexagonal (ports-and-adapters) architecture. Worker throughput scales horizontally by running more instances of that same service; there is no separate "worker" deployment.',
    ],
    whyComponents: [
      {
        title: 'Kafka',
        body: 'Kafka decouples the API from the workers and gives durable, ordered delivery, but its guarantee is at-least-once, not exactly-once. A worker can see the same event twice. That is treated as an expected case, not a bug, which is why duplicate execution is stopped by a Redis lock and a database state machine rather than by trusting the queue to deduplicate for it.',
      },
      {
        title: 'Redis',
        body: 'Redis holds only short-lived, expendable state: a per-task SETNX lock (30s TTL) that lets just one worker execute a task at a time, and the API rate limiter’s counters. Neither needs to survive a restart or be queried later, which is why Redis is never the source of truth for a task’s actual status.',
      },
      {
        title: 'PostgreSQL',
        body: 'PostgreSQL is the source of truth. A task’s full lifecycle (PENDING, RUNNING, COMPLETED, FAILED, DEAD_LETTER) and its history live there as durable rows, not in the queue or the cache. A state machine restricts which transitions are legal, and JPA’s @Version optimistic locking makes two concurrent writes to the same task row fail safely instead of one silently overwriting the other.',
      },
      {
        title: 'Modular monolith',
        body: 'The scheduler ships as one Spring Boot service organized internally with hexagonal architecture, not a set of separate microservices. Worker throughput scales horizontally by running more instances of that same service, joined to the same Kafka consumer group; there is no separate "worker" deployment to build, version, or operate.',
      },
    ],
    keyDecisions: [
      {
        title: 'Duplicate execution, stopped three different ways',
        body: 'Kafka guarantees at-least-once delivery, so a redelivered or duplicate event is an expected case, not an edge case. A Redis lock (SETNX with a 30s TTL) lets only one worker touch a task at a time, and is released with a small Lua script that does an atomic compare-and-delete, so a worker can never release a lock it does not own, which a plain GET-then-DEL would risk. Underneath that, a database state machine only allows a task to transition into RUNNING once at a time, so two concurrent attempts can’t both start it. And underneath that, JPA optimistic locking (@Version) makes two simultaneous writes to the same task row fail safely instead of silently overwriting each other. No single layer is trusted alone.',
      },
      {
        title: 'Backoff instead of hammering, and a real dead-letter path',
        body: 'A failed task is retried with exponential backoff: 10s, then 30s, then 90s (delay = 10 x 3^(retryCount-1)), giving a transient failure (a network blip, a downstream restart) time to clear instead of retrying instantly. With the default of 3 retries, that is an initial attempt plus three more. The fourth failure marks the task DEAD_LETTER in PostgreSQL and publishes it to a dedicated task-dlq Kafka topic for manual inspection, instead of dropping it silently.',
      },
      {
        title: 'Recovering from a crashed worker',
        body: 'If a worker dies mid-task, the task would otherwise sit stuck forever. Its Redis lock eventually expires, but nothing else notices on its own. A background scheduler polls (every 60s, by default) for tasks stuck RUNNING past an execution timeout (5 minutes, by default) and fails them through the same retry path as any other failure. Separately, it re-publishes PENDING tasks whose creation event appears to have been lost. Multiple app instances can run this sweep at once safely. A lost race is just a database exception that gets logged and skipped, because the state machine and optimistic locking are the real guards, not the scheduling.',
      },
      {
        title: 'The build enforces the architecture boundary',
        body: 'The domain layer (entities, services, ports) depends on nothing external: no Spring, no Kafka client, no Redis client. Infrastructure adapters (Redis, Kafka, metrics) implement domain-defined ports. An ArchUnit test fails the build if that boundary is ever crossed, so the architecture cannot quietly rot as the codebase grows.',
      },
    ],
    failureScenarios: [
      {
        title: 'Two workers consume the same redelivered event',
        body: 'Only one acquires the Redis SETNX lock. The other finds it already held and moves on without touching the task. If the lock had somehow already expired and both got through, the database state machine and the @Version optimistic lock still prevent a double-run. A second UPDATE against a stale version fails instead of corrupting state.',
      },
      {
        title: 'A worker crashes while legitimately still running a long task',
        body: 'The recovery sweep’s execution timeout (5 minutes, by default) has to be longer than the Redis lock TTL (30s), so it does not re-queue a task the lock just has not confirmed yet. But if a task genuinely takes longer than that timeout, the sweep can mark it failed and retry it while the original worker is still legitimately working. The state machine still prevents data corruption, but the original worker’s eventual result is discarded rather than surfaced. The fix is operational rather than architectural: set the timeout well above the slowest expected task type. A lease-renewal or fencing-token mechanism would close this properly, and it is the top item in the project’s own known-limitations list.',
      },
      {
        title: 'Retries are exhausted',
        body: 'The fourth failure (initial attempt plus 3 retries) moves the task to DEAD_LETTER and publishes it to the task-dlq Kafka topic, leaving a durable, inspectable trail instead of a task that just disappears.',
      },
    ],
    testing: [
      '164 @Test methods across unit tests and integration tests that run against real PostgreSQL and Redis via Testcontainers, not mocks, so the Redis lock script and the database state machine are exercised against the real thing.',
      'An ArchUnit test enforces the hexagonal boundary at build time.',
      'CI runs the full suite through Maven’s verify goal with a JaCoCo coverage gate set at 80% line and 80% branch; the project’s own README reports the current run at 94.6% line / 90.0% branch.',
    ],
    observability: [
      'Every component (the API, the workers, the retry scheduler, the recovery sweep) reports metrics through Micrometer to Prometheus.',
      'Grafana dashboards (provisioned in the repo under docker/grafana) visualize them, so the state of the system is something you can look at, not just infer from logs.',
    ],
    deployment: [
      'A multi-stage Dockerfile builds a slim runtime image. docker-compose brings up PostgreSQL, Redis, Kafka, Prometheus, and Grafana together for local development.',
      'CI (GitHub Actions) runs as two jobs. The first builds, tests, and enforces the coverage gate against a real Postgres service container. The second, gated on the first passing, builds a multi-platform (amd64/arm64) Docker image with Buildx and pushes it to the GitHub Container Registry on pushes to main.',
    ],
    limitations: [
      'Fixed lock TTL, no lease renewal or fencing tokens. A job whose real runtime exceeds the recovery scheduler’s execution timeout (default 5 minutes) can be marked failed while the original worker is still legitimately running it. The state machine prevents any corruption, but the worker’s real outcome is discarded rather than surfaced. Set the timeout well above the slowest expected job type.',
      'At-least-once delivery end to end (Kafka redelivery, orphan re-publishing, retry re-queuing): job executors with external side effects must be idempotent, since the scheduler does not deduplicate at the business-logic level.',
      'Retries and recovery are both polling-based. Actual retry delay is backoff plus up to one 30-second poll interval, and a stuck job can sit for up to one recovery-scheduler poll interval (default 60s) past its timeout before being noticed.',
      'No leader election for the recovery scheduler. Every app instance runs it independently, which is safe (optimistic locking and the state machine are the real guards, not scheduling) but means redundant recovery attempts under multiple instances.',
      'A single poll cycle caps how many stale jobs it processes (100 by default). A larger backlog clears over several cycles, not immediately.',
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
      'Code review is one of the slowest steps in shipping software. Pull requests often sit for a day or more before a human looks at them.',
      'This app gives a first-pass review in seconds: sign in with GitHub, pick one of your open pull requests, and the app reads the diff and returns a structured review, with each finding tagged by severity and category, an explanation, and where possible a suggested fix, so a human reviewer can spend their time on the harder judgment calls instead of the obvious ones.',
    ],
    architectureNote: [
      'The React/Vite frontend (hosted on AWS Amplify) signs the user in through GitHub OAuth and talks to an Express API (on AWS EC2). The API pulls the user’s repositories and pull requests through the GitHub API via Octokit, fetches the diff for the chosen PR, and sends it to gpt-4o-mini with a prompt that specifies the exact JSON shape to return. Sessions and review history are stored in PostgreSQL; Redis handles the review-result cache and per-user rate limiting. The reviewed result flows back to the frontend as severity-tagged findings.',
      'The interesting engineering here is less about the model call itself and more about building a dependable product around it: handling large diffs, protecting an expensive endpoint from abuse, caching to avoid re-paying for identical work, and treating the model’s output as untrusted input to validate rather than a black box to trust.',
    ],
    keyDecisions: [
      {
        title: 'GitHub OAuth and PR selection',
        body: 'Login goes through GitHub OAuth (Passport), requesting repo scope so the app can read pull request diffs on the user’s behalf. Sessions are stored server-side in PostgreSQL via connect-pg-simple, so a login survives a server restart instead of forcing a re-auth. Picking a PR fetches its metadata and raw diff from GitHub through Octokit, parses the diff into per-file changes, and stores it as a pending review row before any AI call happens.',
      },
      {
        title: 'Large diffs get trimmed, not rejected',
        body: 'gpt-4o-mini has a real context limit. Diffs are capped at 100,000 characters (roughly a 4-characters-per-token estimate, leaving headroom for the response). A diff over that limit is truncated with an explicit "[DIFF TRUNCATED]" marker appended, so an oversized PR still gets a partial, clearly labeled review instead of a hard failure.',
      },
      {
        title: 'A JSON contract, enforced defensively rather than assumed',
        body: 'The system prompt spells out an exact JSON shape: severity levels (critical through info), fixed categories (security, performance, bug, error-handling, style, architecture), and required fields. The request uses OpenAI’s response_format: { type: "json_object" } mode, which guarantees syntactically valid JSON, not a fixed field-by-field shape. That is different from OpenAI’s stricter json_schema structured-output mode with enum-constrained fields; this is a prompt-specified contract instead. So the server never trusts the response blindly. A reply that fails to parse as JSON throws an explicit error instead of corrupting stored data, and a reply that parses but is missing or malformed fields (no issues array, an out-of-range score, no summary) gets defensive defaults applied before anything is persisted.',
      },
      {
        title: 'Rate limiting that fails open, and a cache that saves real money',
        body: 'The review endpoint is the expensive one, since it pays for an OpenAI call, so it is rate limited per user with an atomic Redis INCR against a rate:review:<userId> key, with a 1-hour expiry set only on the first request of the window, capped at 10 reviews per hour. Standard X-RateLimit-Limit / -Remaining / -Reset headers are returned either way. If Redis errors, the limiter deliberately fails open (allows the request through) rather than failing closed. That is a deliberate choice: a broken cache should not be able to take the whole product down. Review results are separately cached in Redis for an hour, keyed by a SHA-256 hash of the diff content, so re-opening the same PR is instant and does not re-pay the OpenAI cost. PostgreSQL is the durable store underneath. The reviews and review_comments tables back the paginated review-history UI and outlive the cache.',
      },
    ],
    failureScenarios: [
      {
        title: 'The model returns text that is not valid JSON',
        body: 'JSON.parse throws, the raw response is logged for debugging, and the request fails with an explicit "AI returned invalid response format" error rather than silently storing garbage.',
      },
      {
        title: 'The model returns valid JSON in the wrong shape',
        body: 'json_object mode guarantees syntax, not content. A missing issues array, an out-of-range score, or a missing summary all get replaced with safe defaults (an empty list, a score of 5, a fallback summary string) before the review is saved, so a slightly-off model response degrades gracefully instead of breaking the UI.',
      },
      {
        title: 'Redis is briefly unavailable',
        body: 'Rate limiting fails open, so reviews keep working, just unmetered, until Redis recovers. Cache reads simply miss, so every review falls through to a real, paid OpenAI call during the outage. That is a deliberate availability-over-cost trade-off, not a crash.',
      },
      {
        title: 'Two requests to process the same review land close together',
        body: 'The handler checks the review’s status and only proceeds if it is not already \'processing\' or \'completed\', returning 409 otherwise. But that check and the status update that follows it are separate database queries, not one atomic operation, so a double OpenAI call for the same review is unlikely but not provably impossible under true concurrency.',
      },
    ],
    testing: [
      'There is no automated test suite in this repository at the time of writing. No test runner is configured, and no test files exist beyond a deliberately vulnerable sample route used to demo the reviewer catching real issues.',
    ],
    observability: [
      'Observability today is request-level logging (PR fetch and processing timing, cache hit/miss, and OpenAI response timing logged to the console) plus a GET /health endpoint for basic liveness checks. There is no metrics or dashboard layer here the way the Task Scheduler has Prometheus and Grafana. That is a smaller-scale setup, worth naming directly rather than glossing over.',
    ],
    deployment: [
      'Packaged with Docker and Docker Compose (which brings up local PostgreSQL and Redis for development). Per the project README, the frontend is deployed on AWS Amplify and the backend API on AWS EC2.',
      'There is no CI/CD pipeline configured in this repository, and no GitHub Actions workflow, so build and deploy are currently manual.',
    ],
    limitations: [
      'Uses OpenAI’s JSON-object response mode plus a prompt-specified shape and defensive server-side coercion, not schema-enforced structured output. A valid-JSON-but-wrong-shape response is caught by defaults, but the contract is not enforced by the model provider itself.',
      'Rate limiting fails open when Redis is unavailable, trading strict quota enforcement for availability.',
      'The "already processing" guard reads and writes review status as separate queries rather than one atomic operation, so two near-simultaneous requests for the same review are not provably prevented from both reaching OpenAI.',
      'No automated test suite or CI pipeline yet.',
      'No metrics or dashboard observability beyond request logging and a health endpoint.',
    ],
  },
};
