pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub'
            }
        }

        stage('Environment Check') {
            steps {
                sh '''
                    echo "=== Git ==="
                    git --version

                    echo "=== Node.js ==="
                    node --version || true

                    echo "=== npm ==="
                    npm --version || true

                    echo "=== Docker CLI ==="
                    docker --version || true

                    echo "=== curl ==="
                    curl --version || true
                '''
            }
        }
    }
}