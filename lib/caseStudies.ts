

import { resumeMatchConfig, resumeMatchMetrics, type Metric } from './content';

export type CaseStudyImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type CaseStudySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  images?: CaseStudyImage[];
};

type CaseStudyBase = {
  slug: string;
  title: string;
  tagline: string;
  repo: string;
  demo?: string;
  stack: string[];
};

export type ClassicCaseStudy = CaseStudyBase & {
  kind?: 'classic';
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

export type SectionedCaseStudy = CaseStudyBase & {
  kind: 'sectioned';
  metrics?: Metric[];
  heroImage?: CaseStudyImage;
  videoUrl?: string;
  sections: CaseStudySection[];
};

export type CaseStudy = ClassicCaseStudy | SectionedCaseStudy;

export const caseStudies: Record<string, CaseStudy> = {
  resumematch: {
    kind: 'sectioned',
    slug: 'resumematch',
    title: 'ResumeMatch',
    tagline: 'A retrieval-augmented generation (RAG) system that compares a resume with 107,528 real LinkedIn job postings and checks every claim against the resume and the posting it came from.',
    repo: 'https://github.com/PubuduGunasekara/rag-resumematch',
    demo: resumeMatchConfig.liveDemoUrl || undefined,
    videoUrl: resumeMatchConfig.demoVideoUrl || undefined,
    stack: ['Python', 'FastAPI', 'Next.js', 'Streamlit', 'ChromaDB', 'sentence-transformers', 'Ollama', 'Docker', 'GitHub Actions'],
    metrics: resumeMatchMetrics,
    heroImage: {
      src: '/assets/resumematch/hero-backend.png',
      alt: 'A ResumeMatch report for a test resume. The closest match is a Lead Java Developer posting, with 4 of 4 requirements shown and each one tied to a quote from the resume.',
      width: 1520,
      height: 1572,
      caption: 'A report for one of my synthetic test resumes: each requirement is tied to a quote from the resume.',
    },
    sections: [
      {
        heading: 'Problem',
        paragraphs: [
          'I wanted a resume checker where every claim can be checked: which requirement a resume meets, which job posting asked for it, and the exact line on the resume that shows it.',
          'ResumeMatch is a retrieval-augmented generation (RAG) system. It retrieves the job postings closest to a resume, then a local model writes the findings and code checks each one. It compares a resume with 107,528 real LinkedIn job postings (237,902 chunks, from 123,849 rows after removing 7 empty and 16,314 duplicate postings). It shows which requirements the resume meets. Every claim is checked against the resume and against the posting it came from.',
          'It started in Fall 2026 as an NLP course project at Northeastern (CS6120). This repository is my own portfolio version, designed and built by me. I built it with Claude Code assistance. The design, the experiments and the measurements are mine.',
          'It runs fully on one machine: bge-small-en-v1.5 embeddings, ChromaDB, and llama3.2:3b through Ollama. The resume never leaves the machine and no paid API is used.',
        ],
      },
      {
        heading: 'Approach',
        paragraphs: [
          'The model only proposes. Code checks that the cited posting really asks for the requirement, that the resume quote is really in the resume, and that a “missing” skill is not listed on the resume. Rankings and verdicts are computed in code, not by the model.',
        ],
        bullets: [
          'Validate the upload.',
          'Correct typos by edit distance, for search only.',
          'Split the resume into sections of at most 480 tokens, because the embedder ignores text past 512 tokens.',
          'Search each section on its own.',
          'Combine the results with reciprocal rank fusion (k=60, top 5, at most 2 per company).',
          'Keep the requirement sentences of those postings.',
          'Make one model call with a JSON schema enforced.',
          'Run code checks on every claim.',
          'Build a report per posting.',
        ],
        images: [
          {
            src: '/assets/resumematch/diagram-overview.png',
            alt: 'Flow diagram of ResumeMatch. An index is built once offline from 123,849 postings into 237,902 chunks in ChromaDB. Each upload is validated, typo-corrected for search, split into sections, searched, reduced to requirement sentences, sent to the local model once with a JSON schema, and every claim is checked before the report is built.',
            width: 2372,
            height: 3229,
            caption: 'The pipeline: an index built once offline, then ten steps for each upload.',
          },
        ],
      },
      {
        heading: 'What failed first',
        paragraphs: ['Each of these is in the engineering log in the repository.'],
        bullets: [
          'The search read only half of a long resume. The embedder ignores text past 512 tokens, so I split the resume into sections of at most 480 tokens and search each one.',
          'Typo correction rewrote “Redis” to “Hedis”. Typo correction is now used for search only.',
          'Employer benefits came back as skills.',
          'A prompt instruction made the model list less. Findings per run fell from 2.8 to 0.2.',
          'With the 3B model, 35 of 48 “matched” claims (73%) cited a posting that never mentioned them (6 runs, one resume, counted with the same lexical checker the app runs). That is why every claim is now checked from both sides.',
        ],
      },
      {
        heading: 'What I measured',
        paragraphs: ['The hardware and the sample size are listed with each number.'],
        bullets: [
          'Speed: a median of 13.8 s per resume (range 11.4 to 19.4 s) on an M3 Pro with Ollama on Metal, over 3 resumes and 9 runs. In Docker on CPU the median was 57 s (35.5 to 72.3 s).',
          'Where the time goes: search and fusion take 0.08 to 0.23 s. About 96% of the time is the model writing.',
          'Tests: 226.',
          'Vector search: recall@30 against exact search was 0.972 after tuning and 0.791 with the defaults (17 resumes, 91 sections).',
          'Typo correction: top-10 overlap at 10% typos was 0.68 to 0.82 without correction and 0.92 to 0.98 with it (4 resumes, 5 seeds).',
          'Chunk cleanup: legal boilerplate in chunks was 26.9% before cleanup and 2.9% after.',
          'Unsupported claims: 35 of 48 “matched” claims (73%) from the 3B model cited a posting that never mentioned them (6 runs, one resume).',
        ],
      },
      {
        heading: 'Limits',
        bullets: [
          'The checks compare wording. A resume that lists NetSuite shows “ERP system” as not found.',
          'I have only tested synthetic resumes so far (20 fictional ones).',
          'I have no ground-truth relevance labels yet, so retrieval quality and claim-check precision are not measured.',
          'The GPU VM profile has not been run.',
        ],
        images: [
          {
            src: '/assets/resumematch/evidence.png',
            alt: 'A ResumeMatch report for a Senior Accountant posting. Four of seven requirements are shown with resume quotes, and three, including ERP system, are listed as not found.',
            width: 1520,
            height: 1535,
            caption: 'A report where three requirements are listed as not found, including “ERP system”.',
          },
        ],
      },
    ],
  },
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
      '188 tests across unit tests and integration tests that run against real PostgreSQL and Redis via Testcontainers, not mocks, so the Redis lock script and the database state machine are exercised against the real thing.',
      'An ArchUnit test enforces the hexagonal boundary at build time.',
      'CI runs the full suite through Maven’s verify goal with a JaCoCo coverage gate set at 80% line and 80% branch; the project’s own README reports the current run at 93.4% line / 91.1% branch.',
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
    stack: ['Node.js', 'Express 5', 'React 19', 'Vite', 'OpenAI gpt-4o-mini (Structured Outputs)', 'Redis', 'PostgreSQL', 'Passport (GitHub OAuth)', 'Octokit', 'Docker', 'GitHub Actions'],
    diagram: 'ai-code-reviewer',
    problem: [
      'Code review is one of the slowest steps in shipping software. Pull requests often sit for a day or more before a human looks at them.',
      'This app gives a first-pass review in seconds: sign in with GitHub, pick one of your open pull requests, and the app reads the diff and returns a structured review, with each finding tagged by severity and category, an explanation, and where possible a suggested fix, so a human reviewer can spend their time on the harder judgment calls instead of the obvious ones.',
    ],
    architectureNote: [
      'The React/Vite frontend (hosted on AWS Amplify) signs the user in through GitHub OAuth and talks to an Express API (on AWS EC2). The API pulls the user’s repositories and pull requests through the GitHub API via Octokit, fetches the diff for the chosen PR, and sends it to gpt-4o-mini with a prompt and a strict JSON schema for the response. Sessions and review history are stored in PostgreSQL; Redis handles the review-result cache and per-user rate limiting. The validated result flows back to the frontend as severity-tagged findings.',
      'The interesting engineering here is less about the model call itself and more about building a dependable product around it: handling large diffs, protecting an expensive endpoint from abuse, caching to avoid re-paying for identical work, and treating the model’s output as untrusted input to validate rather than a black box to trust.',
    ],
    keyDecisions: [
      {
        title: 'GitHub OAuth and PR selection',
        body: 'Login goes through GitHub OAuth (Passport), requesting repo scope so the app can read pull request diffs on the user’s behalf. Sessions are stored server-side in PostgreSQL via connect-pg-simple, so a login survives a server restart instead of forcing a re-auth. Picking a PR fetches its metadata and raw diff from GitHub through Octokit and stores it as a pending review row before any AI call happens.',
      },
      {
        title: 'Large diffs get trimmed, not rejected',
        body: 'gpt-4o-mini has a real context limit. Diffs are capped at 100,000 characters (roughly a 4-characters-per-token estimate, leaving headroom for the response). A diff over that limit is truncated with an explicit "[DIFF TRUNCATED]" marker appended, so an oversized PR still gets a partial, clearly labeled review instead of a hard failure.',
      },
      {
        title: 'A strict schema the model can’t dodge, and validation that fails loudly',
        body: 'The request uses OpenAI’s Structured Outputs (response_format json_schema with strict: true) and an explicit schema: enums for severity (critical through info) and category (security, performance, bug, error-handling, style, architecture), and every field required, including the comment, the suggested fix, and a CWE reference that the prompt asks the model to fill only for security findings. Strict mode guarantees the shape but not the value ranges, so the server checks the rest itself: the score must be an integer from 1 to 10 and there can be at most 15 issues. If the model refuses, returns unparseable JSON, or fails those checks, the review is marked failed and the real error is returned. It is never patched with a made-up score or an empty issue list.',
      },
      {
        title: 'Rate limiting that is atomic and fails open, and a cache that can’t go stale',
        body: 'The review endpoint is the expensive one, since it pays for an OpenAI call, so it is rate limited per user in Redis: a fixed one-hour window capped at 10 reviews, with standard X-RateLimit-Limit / -Remaining / -Reset headers. The increment and the first-time expiry run inside a single Lua script, so a crash between an INCR and an EXPIRE can never leave a key with no TTL and lock a user out forever. If Redis errors, the limiter deliberately fails open (allows the request through) rather than failing closed, because a broken cache should not be able to take the whole product down. Review results are cached in Redis for an hour, keyed by a SHA-256 hash of the model name, the prompt/schema version, and the diff, so re-opening the same PR is instant and free, and shipping a prompt or schema change never serves a review generated under the old rules. PostgreSQL is the durable store underneath: the reviews and review_comments tables back the paginated review-history UI and outlive the cache.',
      },
    ],
    failureScenarios: [
      {
        title: 'The model refuses, or returns output that fails validation',
        body: 'The review is marked failed rather than left retryable, because the same diff would produce the same problem, and the request returns a 502 with the real error. Nothing is saved as a completed review with defaulted fields.',
      },
      {
        title: 'The model returns the right shape with an unacceptable value',
        body: 'Strict mode cannot enforce numeric ranges or array lengths, so a score outside 1 to 10, or more than 15 issues, is caught by the server-side check and treated like any other validation failure: the review fails with a clear error instead of showing a misleading result.',
      },
      {
        title: 'A transient failure (OpenAI rate limit, auth, or network error)',
        body: 'The review reverts to pending so the user can retry without re-fetching the diff from GitHub.',
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
      '19 backend tests (node --test with supertest) cover the structured-output handling, diff truncation, the rate limiter middleware, the atomic rate-limit script, and cache-key invalidation.',
      'OpenAI and Redis are mocked at the module boundary, so the suite runs fast and never calls a real service. That also means the Lua script is tested against a fake Redis, not a real one, unlike the Task Scheduler’s real-database integration tests. The frontend is covered by lint and a production build in CI rather than by tests.',
      'GitHub Actions runs on every push and pull request to main: the backend tests, and the frontend lint and build as a separate job.',
    ],
    observability: [
      'Observability today is request-level logging (PR fetch and processing timing, cache hit/miss, and OpenAI response timing logged to the console) plus a GET /health endpoint for basic liveness checks. There is no metrics or dashboard layer here the way the Task Scheduler has Prometheus and Grafana. That is a smaller-scale setup, worth naming directly rather than glossing over.',
    ],
    deployment: [
      'Packaged with Docker and Docker Compose (which brings up local PostgreSQL and Redis for development). Per the project README, the frontend is deployed on AWS Amplify and the backend API on AWS EC2.',
      'CI runs the tests and builds but does not deploy. Backend deployment to EC2 is a manual Docker rebuild and restart.',
    ],
    limitations: [
      'Diff truncation is character-based, not token-based, and cuts at a fixed length rather than prioritizing the most relevant files, so a large diff can lose its last (possibly important) files entirely. Each review is a single model call with no chunking or multi-pass review, so quality can degrade as a diff approaches the limit.',
      'Rate limiting uses a fixed window, so bursts around a window boundary are possible (close to double the hourly quota split across the boundary). It also fails open when Redis is unavailable, trading strict quota enforcement for availability.',
      'The "already processing" guard reads and writes review status as separate queries rather than one atomic operation, so two near-simultaneous requests for the same review are not provably prevented from both reaching OpenAI.',
      'No data retention policy. Full diffs and review results are kept in PostgreSQL indefinitely, with no cleanup or archival job yet.',
      'Tests mock OpenAI and Redis rather than running against real ones, and there are no frontend tests.',
      'No metrics or dashboard observability beyond request logging and a health endpoint, and deployment to EC2 is manual.',
    ],
  },
};
