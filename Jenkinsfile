pipeline {
    agent any

    environment {
        REGISTRY = 'docker.io'
        IMAGE_NAME = 'college-management-system'
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = credentials('kubeconfig-credential-id')
        NAMESPACE = 'college-management'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker image...'
                script {
                    sh 'docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .'
                    sh 'docker tag ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Push to Registry') {
            steps {
                echo 'Pushing image to Docker Registry...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}'
                        sh 'docker push ${REGISTRY}/${IMAGE_NAME}:latest'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                script {
                    sh '''
                        kubectl apply -f deployment.yaml
                        kubectl set image deployment/college-management-system \
                          college-management=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                          -n ${NAMESPACE}
                        kubectl rollout status deployment/college-management-system -n ${NAMESPACE}
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    sh '''
                        kubectl get pods -n ${NAMESPACE}
                        kubectl describe service cms-service -n ${NAMESPACE}
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker images...'
            sh 'docker logout'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed! Check logs above.'
        }
    }
}
