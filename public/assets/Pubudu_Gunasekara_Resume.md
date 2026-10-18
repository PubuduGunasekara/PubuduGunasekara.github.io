# Pubudu Gunasekara

San Jose, CA | pubudupguna@gmail.com  
LinkedIn: https://linkedin.com/in/pubudugunasekera  
GitHub: https://github.com/PubuduGunasekara  
Portfolio: https://pubudugunasekara.github.io

MS Computer Science, Northeastern University | Seeking Software Engineering Internship, Summer 2027

## Education

### Northeastern University, Khoury College of Computer Sciences, San Jose, CA

M.S. in Computer Science | GPA: 4.0 / 4.0  
Jan 2026 - May 2028 (Expected)

Coursework: Algorithms, Programming Design Paradigms; in progress: Machine Learning, NLP (RAG system)

### Conestoga College, Postgraduate Certificate in Mobile Solutions Development

GPA: 3.74 / 4.0  
2022 - 2023

### Victoria University, Bachelor of Information Technology

GPA: 6.25 / 7.0  
2018 - 2021

## Experience

### Food Services & Hospitality, Waterloo, Canada

Jan 2024 - Dec 2025

### Virtusa, Associate Engineer (QA), Colombo, Sri Lanka

Jun 2021 - Mar 2022

- Wrote Java and Selenium WebDriver automated tests inside the team's framework for a British Telecommunications (BT) platform serving 1M+ users. Designed and ran test plans across agile sprints.
- Finished assigned sprint tickets ahead of the sprint end, leaving room for peer review and ad hoc requests. Ran client demos and daily stand-ups when the QA lead delegated them, and tracked defect density and open defect counts.

## Projects

### Distributed Task Scheduler

[Code](https://github.com/PubuduGunasekara/distributed-task-scheduler) · [Case Study](https://pubudugunasekara.github.io/projects/task-scheduler/)  
Java 21, Spring Boot, Kafka, Redis, PostgreSQL, Prometheus, Docker, GitHub Actions

- Built a task scheduler on hexagonal architecture (enforced with ArchUnit) that guards against duplicate execution under Kafka's at-least-once delivery, using a database state machine, optimistic locking and a Redis distributed lock.
- Handles failures with 3 retries (10s, 30s, 90s backoff), a dead-letter topic, and a recovery job that re-queues stuck tasks and re-publishes lost creation events. Redis rate limiting protects the API.
- 188 tests with 93.4% line and 91.1% branch coverage (80% gate in CI); integration tests run against real PostgreSQL and Redis through Testcontainers.

### AI Code Review Assistant

[Code](https://github.com/PubuduGunasekara/ai-code-reviewer) · [Live Demo](https://main.d3dm91k4g9mtr9.amplifyapp.com/)  
React 19/Vite, Node.js/Express, PostgreSQL, Redis, gpt-4o-mini, Docker, AWS

- Shipped a GitHub OAuth app (React on AWS Amplify, Express on EC2) that reviews a pull request and returns findings tagged by severity and category, each with a CWE reference and suggested fix.
- Strict JSON-schema output (OpenAI Structured Outputs) that fails a review rather than inventing results, a per-user hourly rate limit (atomic Lua script) and a Redis cache keyed on diff, model and prompt version. 19 backend tests.

### Smart Farm

[Code](https://github.com/PubuduGunasekara/smart-farm-1.1.0) | [Demo](https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-activity-6794023495358644225-3E9L)  
React Native (Expo), Redux, Firebase, Arduino, ESP

- Built the app's device-control section and the physical Arduino farm model. The control panel (water, food, gate, cleaning) sends commands through Firebase to WiFi-enabled Arduino/ESP controllers that drive relays and motors.
- Team project, one of the Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition.

### Travel Day Scheduler

[Code](https://github.com/PubuduGunasekara/SmartTravelPlanner)  
Python, Weighted A* Search

- Graduate algorithms team project (team of 2): a weighted / anytime A* itinerary planner with heap pruning. Wrote the initial search and the route-visualization frontend.

## Technical Skills

- **Languages:** Java, JavaScript, Python, SQL, C++ (Arduino)
- **Backend & Distributed:** Spring Boot, Node.js / Express, Apache Kafka, Redis, PostgreSQL, Firebase, REST APIs
- **Infra & DevOps:** Docker, Docker Compose, GitHub Actions, CI/CD, Jenkins, Prometheus, Grafana, AWS
- **Frontend:** React, Next.js, React Native, Vite, Redux
- **Certifications:** Microsoft Azure Fundamentals (AZ-900), IBM Full Stack Software Developer

## Leadership

- Founding Cohort Member, Graduate Student Career Advisory Board, Northeastern University (Khoury College)
