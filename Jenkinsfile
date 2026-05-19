pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_USERNAME = 'singhayush24'

        // versioned tagging (VERY IMPORTANT)
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build React') {
            steps {
                dir('Banking') {
                    sh '''
                        echo "Building React App..."

                        npm install
                        npm run build

                        echo "Building Docker Image for React..."
                        docker build -t ${DOCKER_USERNAME}/reactapp:${IMAGE_TAG} .

                        echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin

                        docker push ${DOCKER_USERNAME}/reactapp:${IMAGE_TAG}

                        docker logout
                    '''
                }
            }
        }

        stage('Build Spring Boot') {
            steps {
                dir('SpringDemo') {
                    sh '''
                        echo "Building Spring Boot App..."

                        export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
                        export PATH=$JAVA_HOME/bin:$PATH

                        java -version
                        mvn -version

                        mvn clean package -DskipTests

                        echo "Building Docker Image for Spring Boot..."
                        docker build -t ${DOCKER_USERNAME}/resource:${IMAGE_TAG} .

                        echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin

                        docker push ${DOCKER_USERNAME}/resource:${IMAGE_TAG}

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                        echo "Deploying React App..."

                        /usr/local/bin/kubectl set image deployment/react-app -n myapp \
                        react=${DOCKER_USERNAME}/reactapp:${IMAGE_TAG}

                        echo "Deploying Spring Boot App..."

                        /usr/local/bin/kubectl set image deployment/springboot-app -n myapp \
                        springboot=${DOCKER_USERNAME}/resource:${IMAGE_TAG}

                        echo "Waiting for rollout (React)..."
                        /usr/local/bin/kubectl rollout status deployment/react-app -n myapp

                        echo "Waiting for rollout (Spring Boot)..."
                        /usr/local/bin/kubectl rollout status deployment/springboot-app -n myapp
                    '''
                }
            }
        }
    }
}