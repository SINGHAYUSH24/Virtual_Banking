pipeline {
    agent any
    
    environment {
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'singhayush24'
    }
    
    stages {
        stage('Build React') {
            steps {
                dir('Banking') {
                    sh '''
                        npm install
                        npm run build
                        docker build -t ${DOCKER_USERNAME}/reactapp:latest .
                        docker push ${DOCKER_USERNAME}/reactapp:latest
                    '''
                }
            }
        }
        
        stage('Build Spring Boot') {
            steps {
                dir('SpringDemo') {
                    sh '''
                        mvn clean package -DskipTests
                        docker build -t ${DOCKER_USERNAME}/resource:latest .
                        docker push ${DOCKER_USERNAME}/resource:latest
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                        kubectl set image deployment/react-app -n myapp react=${DOCKER_USERNAME}/reactapp:latest
                        kubectl set image deployment/springboot-app -n myapp springboot=${DOCKER_USERNAME}/resource:latest
                        kubectl rollout status deployment/react-app -n myapp
                        kubectl rollout status deployment/springboot-app -n myapp
                    '''
                }
            }
        }
    }
}