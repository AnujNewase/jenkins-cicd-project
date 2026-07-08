pipeline {
    agent any

    stages {
        stage('Pipeline Check') {
            steps {
                echo 'Pipeline loaded successfully from Jenkinsfile'
            }
        }

        stage('Environment Check') {
            steps {
                sh 'whoami'
                sh 'pwd'
                sh 'git --version'
            }
        }
    }
}