# Pubudu Gunasekara

San Jose, CA | pubudupguna@gmail.com  
LinkedIn: https://linkedin.com/in/pubudugunasekera  
GitHub: https://github.com/PubuduGunasekara  
Portfolio: https://pubudugunasekara.github.io

Master of Science, Northeastern University | Seeking Software Engineering Internship, Summer 2027

## Education

### Northeastern University, Khoury College of Computer Sciences, San Jose, CA

Master of Science in Computer Science | GPA: 4.0 / 4.0  
01/2026 - 05/2028 (Expected)

Coursework: Algorithms, Programming Design Paradigms, Machine Learning, Natural Language Processing

### Conestoga College, Postgraduate Certificate in Mobile Solutions Development

GPA: 3.74 / 4.0  
2022 - 2023

### Victoria University, Bachelor of Information Technology

GPA: 6.25 / 7.0  
2018 - 2021

## Experience

### Food Services & Hospitality, Team Member, Waterloo, Canada

01/2024 - 12/2025

### Virtusa, Associate Engineer (Quality Assurance), Colombo, Sri Lanka

06/2021 - 03/2022

- Wrote Java and Selenium WebDriver tests and ran test plans in agile sprints for a British Telecommunications (BT) platform serving 1M+ users.
- Closed about 10 tickets per 2-week sprint, 2-3 days early, then handled peer review, ad hoc tasks, client demos and meetings. Tracked defect density and open defect counts.

## Projects

### Distributed Task Scheduler

[Case Study](https://pubudugunasekara.github.io/projects/task-scheduler/) | [github.com/PubuduGunasekara/distributed-task-scheduler](https://github.com/PubuduGunasekara/distributed-task-scheduler)  
Java 21, Spring Boot, Kafka, Redis, PostgreSQL, Prometheus, Docker, GitHub Actions

- Task scheduler on hexagonal architecture (ArchUnit-enforced). Prevents duplicate execution under Kafka's at-least-once delivery with a database state machine, optimistic locking and a Redis lock. Failures: 3 retries (10s, 30s, 90s), dead-letter topic, recovery job for stuck tasks.
- 188 tests, 93.4% line and 91.1% branch coverage (80% CI gate). Load test throughput: ~2,700 tasks/min (1,000 simulated tasks, 3 consumers, local), zero duplicate runs.

### AI Code Review Assistant

[Live Demo](https://main.d3dm91k4g9mtr9.amplifyapp.com/) | [github.com/PubuduGunasekara/ai-code-reviewer](https://github.com/PubuduGunasekara/ai-code-reviewer)  
React 19/Vite, Node.js/Express, PostgreSQL, Redis, gpt-4o-mini, Docker, AWS

- GitHub OAuth app (React on AWS Amplify, Express on EC2) that reviews pull requests. Each finding has a severity, category, CWE reference and suggested fix.
- Strict JSON-schema output (OpenAI Structured Outputs): an invalid response fails the review instead of returning made-up results. Hourly per-user rate limit (Lua), Redis cache, 19 tests. 5 test reviews: 8.4 s latency, about $0.002 each.

### Smart Farm

[Demo](https://www.linkedin.com/posts/pubudugunasekera_softwareengineering-iot-fullstackdevelopment-activity-6794023495358644225-3E9L) | [github.com/PubuduGunasekara/smart-farm-1.1.0](https://github.com/PubuduGunasekara/smart-farm-1.1.0)  
React Native (Expo), Redux, Firebase, Arduino, ESP

- Built the app's device-control section and the physical Arduino farm model. The app sends water, feed, gate and cleaning commands through Firebase to WiFi Arduino/ESP controllers that drive relays and motors.
- Top 10 Most Innovative Projects at the NSBM Green EXE v1.0 software competition (team project).

### Travel Day Scheduler

[github.com/PubuduGunasekara/SmartTravelPlanner](https://github.com/PubuduGunasekara/SmartTravelPlanner)  
Python, Weighted A* Search

- Team of 2, graduate algorithms: day-trip planner using A* search. Wrote the first search and the route map.

## Technical Skills

- **Languages:** Java, Python, JavaScript, TypeScript, SQL, C++ (Arduino)
- **Backend:** Spring Boot, Node.js, Express, Kafka, Redis, PostgreSQL, MongoDB, REST APIs
- **Infra & DevOps:** Linux, Git, Docker, GitHub Actions, CI/CD, Jenkins, Prometheus, Grafana, AWS
- **Frontend & Mobile:** React, Next.js, React Native, Vite, Redux, Firebase
- **Concepts:** Distributed Systems, Data Structures, Object-Oriented Design, Concurrency, Unit Testing, Debugging
- **Certifications:** Microsoft Azure Fundamentals (AZ-900), IBM Full Stack Software Developer
