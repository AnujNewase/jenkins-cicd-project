pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running automated tests...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building versioned Docker image...'
                sh 'docker build -t jenkins-cicd-app:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Removing previous application container if it exists...'

                sh '''
                    docker rm -f jenkins-cicd-container || true
                '''

                echo 'Deploying new application container...'

                sh '''
                    docker run -d \
                    --name jenkins-cicd-container \
                    -p 3000:3000 \
                    jenkins-cicd-app:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Verifying application health...'

                sh '''
                    sleep 3
                    curl --fail http://host.docker.internal:3000/health
                '''
            }
        }
    }
}