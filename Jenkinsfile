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
                echo 'Building Docker image...'
                sh 'docker build -t jenkins-cicd-app:latest .'
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
            jenkins-cicd-app:latest
        '''
    }
}