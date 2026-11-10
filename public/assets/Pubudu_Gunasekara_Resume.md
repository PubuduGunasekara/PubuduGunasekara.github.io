# Pubudu Gunasekara

San Jose, CA | pubudupguna@gmail.com  
LinkedIn: https://linkedin.com/in/pubudugunasekera  
GitHub: https://github.com/PubuduGunasekara  
Portfolio: https://pubudugunasekara.github.io

MS in Computer Science, Northeastern | Seeking Software Engineering Internship, Summer 2027

## Education

### Northeastern University, Khoury College of Computer Sciences

Master of Science in Computer Science | GPA: 4.0 / 4.0  
01/2026 - 05/2028 (Expected)

Coursework: Algorithms, Programming Design Paradigm; in progress: Machine Learning, NLP

### Conestoga College, Graduate Certificate in Mobile Solutions Development

GPA: 3.74 / 4.0  
2022 - 2023

Coursework: Android and iOS Application Development, Android Wear, Mobile Capstone

### Victoria University, Bachelor of Information Technology

GPA: 6.25 / 7.0  
2018 - 2021

Major: Web and Mobile Application Development

## Experience

### Virtusa, Associate Engineer (Quality Assurance), Colombo, Sri Lanka

06/2021 - 03/2022

- Verified a British Telecommunications (BT) platform serving 1M+ users by writing Java and Selenium WebDriver tests and running test plans in agile sprints.
- Closed about 10 tickets per 2-week sprint, 2-3 days early, while handling peer reviews, client demos and meetings, and tracking defect density and open defect counts.

### Food Services & Hospitality, Team Member, Waterloo, Canada

01/2024 - 12/2025

## Projects

### Distributed Task Scheduler

[Case Study](https://pubudugunasekara.github.io/projects/task-scheduler/) | [github.com/PubuduGunasekara/distributed-task-scheduler](https://github.com/PubuduGunasekara/distributed-task-scheduler)  
Java 21, Spring Boot, Kafka, Redis, PostgreSQL, Prometheus, Docker, GitHub Actions

- Prevented duplicate task runs under Kafka's at-least-once delivery (zero duplicates in a 1,000-task load test) by combining a database state machine, optimistic locking and a Redis lock, with backoff retries, a dead-letter topic and a recovery job.
- Sustained ~2,700 tasks/min (3 consumers, local) with 188 tests, 93.4% line and 91.1% branch coverage (80% CI gate), on a hexagonal architecture enforced by ArchUnit.

### ResumeMatch

[github.com/PubuduGunasekara/rag-resumematch](https://github.com/PubuduGunasekara/rag-resumematch)  
Python, FastAPI, ChromaDB, Ollama, Next.js, Docker, GitHub Actions

- Matched a resume against 107,528 LinkedIn postings (237,902 chunks) in 13.8 s median, fully on a laptop, by building a RAG pipeline: bge-small embeddings, ChromaDB search with rank fusion and a 3B model via Ollama.
- Caught unsupported RAG claims (the model cited the wrong posting for 73% of its "matched" requirements, 35 of 48) by checking every claim in code before it is shown, and raised recall@30 from 0.79 to 0.97 by tuning the vector index. 226 tests, CI.

### AI Code Review Assistant

[Live Demo](https://main.d3dm91k4g9mtr9.amplifyapp.com/) | [github.com/PubuduGunasekara/ai-code-reviewer](https://github.com/PubuduGunasekara/ai-code-reviewer)  
React 19/Vite, Node.js/Express, PostgreSQL, Redis, gpt-4o-mini, Docker, AWS

- Delivered pull-request reviews in 8.4 s at ~$0.002 each (5 test reviews) with a GitHub OAuth app (React on AWS Amplify, Express on EC2) that returns a severity, category, CWE reference and fix per finding.
- Made model output dependable with strict JSON-schema output (OpenAI Structured Outputs), so a malformed response fails the review, plus an hourly per-user rate limit (Lua) and Redis cache. 19 tests.

### Smart Farm

[Demo](https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-activity-6794023495358644225-3E9L) | [github.com/PubuduGunasekara/smart-farm-1.1.0](https://github.com/PubuduGunasekara/smart-farm-1.1.0)  
React Native (Expo), Redux, Firebase, Arduino, ESP

- Built the device-control section of a team IoT app and the physical Arduino farm model, sending water, feed, gate and cleaning commands over Firebase to WiFi Arduino/ESP controllers that drive relays and motors.
- Top 10 Most Innovative Projects, NSBM Green EXE v1.0 software competition (team project).

## Technical Skills

- **Languages:** Java, Python, JavaScript, SQL, C++ (Arduino)
- **Backend & AI:** Spring Boot, Node.js/Express, FastAPI, REST APIs, Kafka, Redis, PostgreSQL, RAG, OpenAI API
- **Infra & testing:** Docker, AWS, Linux, GitHub Actions, CI/CD, Prometheus, Selenium
- **Frontend & mobile:** React, Next.js, React Native (Expo), Redux, Firebase
- **Certifications:** Azure Fundamentals (AZ-900), IBM Full Stack Software Developer, Meta Android Developer
