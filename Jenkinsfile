pipeline {
    agent any

    tools {
        jdk 'JDK_HOME'
    }

    environment {
        FRONTEND_DIR = 'academic-compass-io'

        TOMCAT_URL = 'http://localhost:9090/manager/text'
        TOMCAT_USER = 'Admin'
        TOMCAT_PASS = 'admin'

        FRONTEND_WAR = 'frontapp1.war'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // ensures no old refs like "master" remain
            }
        }

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/rithvik1138/academic-compass-io.git'
            }
        }

        stage('Build Frontend (Vite)') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    script {
                        def nodeHome = tool name: 'NODE_HOME', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                        env.PATH = "${nodeHome}/bin:${env.PATH}"
                    }
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Package Frontend as WAR') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh """
                        mkdir -p frontend_war/WEB-INF/classes
                        cp -r dist/* frontend_war/
                        jar -cvf ${env.WORKSPACE}/${FRONTEND_WAR} -C frontend_war .
                    """
                }
            }
        }

        stage('Deploy Frontend to Tomcat (/frontapp1)') {
            steps {
                script {
                    sh """
                        curl -u ${TOMCAT_USER}:${TOMCAT_PASS} \
                          --upload-file ${env.WORKSPACE}/${FRONTEND_WAR} \
                          "${TOMCAT_URL}/deploy?path=/frontapp1&update=true"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Frontend deployed successfully!"
            echo "Visit: http://localhost:9090/frontapp1"
        }
        failure {
            echo "❌ Build or deployment failed"
        }
    }
}

