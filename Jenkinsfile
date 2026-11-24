pipeline {
    agent any

    environment {
        GIT_TERMINAL_PROMPT = '0'
        GCM_INTERACTIVE     = 'never'
        NPM_CACHE           = 'C:\\ProgramData\\Jenkins\\.jenkins\\.npm-cache'
    }

    stages {
        stage('拉取代码') {
            steps {
                checkout scm
            }
        }

        stage('安装依赖') {
            steps {
                bat 'set "PATH=C:\\Users\\260631\\AppData\\Roaming\\npm;D:\\nodejs;%PATH%" && npm ci --cache "%NPM_CACHE%" --prefer-offline --no-audit --no-fund && echo STEP_OK'
            }
        }

        stage('构建') {
            steps {
                bat 'set "PATH=C:\\Users\\260631\\AppData\\Roaming\\npm;D:\\nodejs;%PATH%" && npm run build && echo STEP_OK'
            }
        }

        stage('归档产物') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success { echo "构建成功：${env.BRANCH_NAME} 的 dist 已归档" }
        failure { echo '失败，看控制台输出里的 npm ERR / error TS' }
    }
}
