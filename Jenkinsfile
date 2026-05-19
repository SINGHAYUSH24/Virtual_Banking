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

                        echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin
                        docker push ${DOCKER_USERNAME}/reactapp:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Build Spring Boot') {
            steps {
                dir('SpringDemo') {
                    sh '''
                        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
                        export PATH=$JAVA_HOME/bin:$PATH

                        java -version
                        javac -version
                        mvn -version
                        
                        mvn clean package -DskipTests
                        docker build -t ${DOCKER_USERNAME}/resource:latest .

                        echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin
                        docker push ${DOCKER_USERNAME}/resource:latest
                        docker logout
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