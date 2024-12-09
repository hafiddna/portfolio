pipeline {
    agent {
        node {
            label 'osing-bahari-fe'
        }
    }

    triggers {
        pollSCM('* * * * *')
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'sudo make stop-production'
                sh 'sudo make build-production'
            }
        }

        stage('Run') {
            steps {
                sh 'sudo make start-production'
            }
        }
    }
}
