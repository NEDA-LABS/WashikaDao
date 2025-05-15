 pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Get to the image folder') {
            steps {
                sh 'cd Washika-dao-frontend'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t wd-frontend .'
            }
        }
        stage('Stop and Remove Existing Container') {
            steps {
                script {
                    try {
                        sh 'docker stop wd-frontend'
                    } catch (Exception e) {
                        println 'No running container to stop.'
                    }
                    try {
                        sh 'docker rm wd-frontend'
                    } catch (Exception e) {
                        println 'No existing container to remove.'
                    }
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 5173:5173 --name wd-frontend -e VITE_THIRDWEB_CLIENT_ID=${VITE_THIRDWEB_CLIENT_ID} wd-frontend'
            }
        }
    }
    environment {
        VITE_THIRDWEB_CLIENT_ID = "${env.VITE_THIRDWEB_CLIENT_ID}" // Or define directly here
    }
}
