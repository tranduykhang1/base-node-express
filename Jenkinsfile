pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Run npm install
                    sh 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    // Run tests (e.g., using Jest or Mocha)
                    sh 'npm test'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    // Build your project
                    sh 'npm run build'
                }
            }
        }
    }
}
