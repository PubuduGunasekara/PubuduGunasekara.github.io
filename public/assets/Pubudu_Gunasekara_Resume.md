# Pubudu Gunasekara

San Jose, CA | pubudupguna@gmail.com  
LinkedIn: https://linkedin.com/in/pubudugunasekera  
GitHub: https://github.com/PubuduGunasekara  
Portfolio: https://pubudugunasekara.github.io

MS Computer Science, Northeastern University | Seeking Software Engineering Internship, Summer 2027

## Education

### Northeastern University, Khoury College of Computer Sciences - San Jose, CA

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

### Virtusa - Associate Engineer, QA

Jun 2021 - Mar 2022 · Colombo, Sri Lanka

- Built Java and Selenium WebDriver test automation for a British Telecommunications platform serving 1M+ users, designing and executing test cases and test plans to verify system functionality across agile sprints.
- Led test planning and ran client demos and daily stand-ups for the module under the QA lead's delegation, and collaborated with developers to validate bug fixes.
- Tracked QA metrics including defect densities and open defect counts, working across CST Environment, Camunda Cockpit, RabbitMQ, Swagger UI, and MQ Console.

### Gunasekara Transport - Web Developer

Dec 2025 - Jun 2026 · Remote

- Built the corporate website and web app interfaces, plus an internal business management system (HR, operational workflows, and reporting) that replaced manual processes, using React.js, JavaScript, PHP, WordPress, and Docker.

## Projects

### Distributed Task Scheduler

[Code](https://github.com/PubuduGunasekara/distributed-task-scheduler) · [Case Study](https://pubudugunasekara.github.io/projects/task-scheduler/)  
Java 21, Spring Boot 3.5, Apache Kafka, Redis, PostgreSQL, Prometheus, Grafana, Docker, GitHub Actions

- Built a distributed task scheduler on a hexagonal architecture enforced at build time via ArchUnit, with at-least-once delivery over Kafka and a state-machine guard that prevents duplicate execution on redelivery.
- Implemented a Redis distributed lock (atomic SETNX acquire, Lua compare-and-delete release) and an exponential-backoff retry scheduler (10s, 30s, 90s) with dead-letter handling.
- Instrumented the system end-to-end with Prometheus metrics and Grafana dashboards; containerized with Docker Compose and automated build/test in GitHub Actions CI.

### AI Code Review Assistant

[Code](https://github.com/PubuduGunasekara/ai-code-reviewer) · [Live Demo](https://main.d3dm91k4g9mtr9.amplifyapp.com/) · [Case Study](https://pubudugunasekara.github.io/projects/ai-code-reviewer/)  
React 19 / Vite, Node.js / Express, PostgreSQL, Redis, gpt-4o-mini, Docker, AWS

- Built and deployed a full-stack app that reviews a selected GitHub pull request via GitHub OAuth, returning severity- and category-tagged findings from gpt-4o-mini in a strict JSON schema.
- Engineered per-user Redis rate limiting with a fail-open policy and standard rate-limit headers, plus diff truncation to stay within the model's context budget.

### Travel Day Scheduler

[Code](https://github.com/PubuduGunasekara/SmartTravelPlanner)  
Python, Weighted A* Search | Graduate algorithms project (team)

- Co-designed a weighted / anytime A* itinerary planner (team of 2) with iterative weight escalation and heap pruning to bound memory under large search spaces; implemented the initial weighted A* search and built the route-visualization frontend.

## Technical Skills

- **Languages:** Java, JavaScript, Python, SQL
- **Backend & Distributed:** Spring Boot, Node.js / Express, Apache Kafka, Redis, PostgreSQL, MongoDB, REST APIs, hexagonal architecture
- **Infra & DevOps:** Docker, Docker Compose, GitHub Actions, CI/CD, Jenkins, Prometheus, Grafana, AWS
- **Frontend:** React, Next.js, React Native, Vite, Redux

## Leadership

- Founding Cohort Member, Graduate Student Career Advisory Board, Northeastern University (Khoury College)
