# Jenkins CI/CD Pipeline for a Dockerized Task Manager API

A hands-on DevOps project demonstrating an automated CI/CD pipeline for a containerized Node.js application using Jenkins and Docker.

The application is a lightweight Task Manager REST API with an interactive CLI client. The primary focus of the project is CI/CD automation, automated testing, Docker image versioning, deployment, health verification, failure handling, and rollback.

## Project Overview

The pipeline automatically processes application changes through the following workflow:

Developer Code Change
→ Git Commit and Push
→ Jenkins Detects Repository Change
→ Source Code Checkout
→ Dependency Installation
→ Automated Testing
→ Versioned Docker Image Build
→ Existing Container Replacement
→ New Container Deployment
→ Application Health Check

If the automated tests fail, the Docker build and deployment stages are skipped, ensuring that failing code is not deployed.

## Features

### Task Manager API

The Node.js and Express application provides endpoints for:

* Creating tasks
* Viewing tasks
* Marking tasks as completed
* Deleting tasks
* Checking application health
* Viewing application information

### Interactive CLI Client

The project includes a command-line client that communicates with the REST API over HTTP.

The CLI allows users to:

* Add a task
* View existing tasks
* Mark a task as completed
* Delete a task

Run the CLI using:

```bash
npm run cli
```

The API must be running on port `3000` before starting the CLI.

## Technology Stack

* Node.js
* Express.js
* Jest
* Supertest
* Docker
* Jenkins
* Git
* GitHub

## Repository Structure

```text
jenkins-cicd-project/
├── test/
│   └── app.test.js
├── .dockerignore
├── .gitattributes
├── .gitignore
├── app.js
├── cli.js
├── Dockerfile
├── Dockerfile.jenkins
├── Jenkinsfile
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## REST API Endpoints

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/`              | Basic application response             |
| GET    | `/health`        | Application health verification        |
| GET    | `/api/info`      | Application and deployment information |
| GET    | `/api/tasks`     | View all tasks                         |
| POST   | `/api/tasks`     | Create a new task                      |
| PATCH  | `/api/tasks/:id` | Update task completion status          |
| DELETE | `/api/tasks/:id` | Delete a task                          |

## Automated Testing

The project uses Jest and Supertest for automated API testing.

The test suite verifies:

* Health endpoint response
* Application information endpoint
* Task creation
* Task listing
* Task completion update
* Task deletion

Run the tests locally using:

```bash
npm test
```

The Jenkins pipeline runs the same automated tests before building or deploying the application.

## Dockerization

The Task Manager API is packaged as a Docker image.

Build the application image manually:

```bash
docker build -t jenkins-cicd-app:latest .
```

Run the container:

```bash
docker run -d --name jenkins-cicd-container -p 3000:3000 jenkins-cicd-app:latest
```

The application is then available on port `3000`.

## Jenkins Environment

Jenkins runs inside a Docker container using a custom Jenkins image defined in `Dockerfile.jenkins`.

The custom image includes the tools required by the pipeline:

* Git
* Node.js
* npm
* Docker CLI
* curl

The Jenkins container communicates with Docker Desktop through the mounted Docker socket.

This allows Jenkins pipeline stages to build Docker images and manage application containers on the host Docker engine.

## CI/CD Pipeline Stages

The Jenkins pipeline is defined as code in the `Jenkinsfile`.

The pipeline contains the following stages:

1. Checkout source code
2. Install Node.js dependencies
3. Run automated tests
4. Build a versioned Docker image
5. Remove the previous application container
6. Deploy the new application container
7. Verify deployment using the health endpoint

## Build-Specific Docker Image Versioning

Each successful Docker build uses the Jenkins build number as its image tag.

Example:

```text
Jenkins Build #13 → jenkins-cicd-app:13
Jenkins Build #15 → jenkins-cicd-app:15
```

If a pipeline fails before the Docker build stage, no image is produced for that build number.

For example:

```text
Build #13 → Successful → Image 13 created and deployed
Build #14 → Tests failed → No image created and no deployment
Build #15 → Successful → Image 15 created and deployed
```

This provides artifact traceability and allows previous successful images to be used for rollback.

## Failure Handling

A controlled failure test was performed by intentionally causing an automated test to fail.

The observed pipeline behavior was:

```text
Install Dependencies    SUCCESS
Run Tests               FAILURE
Build Docker Image      SKIPPED
Deploy Application      SKIPPED
Health Check            SKIPPED
```

The previously deployed healthy application container remained running and continued serving requests.

This demonstrates the test stage acting as a quality gate before build and deployment.

## Rollback Demonstration

The project also demonstrates manual rollback using versioned Docker images.

A previous successful image was redeployed by removing the current application container and starting a new container from the earlier image version.

The rollback was verified by:

* Inspecting the image used by the running container
* Calling the `/health` endpoint
* Confirming that the restored application responded successfully

After validating rollback, the latest successful image was restored.

## Health Check

After deployment, the pipeline verifies application availability using:

```text
GET /health
```

Expected response:

```json
{
  "status": "healthy"
}
```

This confirms that the application inside the newly deployed container is responding successfully.

## Automatic Pipeline Triggering

The local Jenkins pipeline uses SCM polling to detect changes in the GitHub repository.

When a new commit is pushed:

```text
Git Push
   ↓
Jenkins Detects Repository Change
   ↓
Pipeline Starts Automatically
```

SCM polling was used because the Jenkins server runs locally and is not directly reachable from the public internet.

In a publicly accessible Jenkins environment, a GitHub webhook could be used for event-driven pipeline triggering.

## Local Application Usage

Install dependencies:

```bash
npm ci
```

Run automated tests:

```bash
npm test
```

Start the API:

```bash
npm start
```

Run the interactive CLI in another terminal:

```bash
npm run cli
```

The CLI communicates with the Task Manager API running on port `3000`.

## Key DevOps Concepts Demonstrated

* Continuous Integration
* Continuous Delivery and Deployment Automation
* Pipeline as Code
* Automated Testing as a Quality Gate
* Docker Containerization
* Build Artifact Versioning
* Build Traceability
* Automated Container Redeployment
* Deployment Health Verification
* Failure Handling
* Manual Rollback and Recovery
* SCM-Based Automatic Pipeline Triggering
* Persistent Jenkins Configuration Using Docker Volumes

## Current Limitation

Task data is stored in application memory. Tasks are reset when the application container is replaced or restarted.

This design keeps the project focused on CI/CD and container deployment. Persistent database storage can be added as a future enhancement.

## Future Improvements

* Add persistent database storage
* Push versioned images to a container registry
* Replace SCM polling with webhook-based triggering on a publicly reachable Jenkins server
* Add automated rollback based on deployment health-check failure
* Add separate development, staging, and production environments
* Add image vulnerability scanning and additional security checks to the pipeline

## Project Purpose

This project was built to gain hands-on experience with the complete CI/CD lifecycle rather than only learning individual tools in isolation.

It demonstrates how source-code changes move through automated testing, container image creation, versioned artifact management, deployment, health verification, failure prevention, and rollback.
