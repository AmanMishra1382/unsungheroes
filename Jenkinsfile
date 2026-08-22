pipeline{
    agent any
    stages{
        stage('Checkout'){
            steps{
                checkout scm
            }
        }
        stage('Build Image'){
            steps{
                sh 'docker compose build'
            }
        }
        stage('Start Database'){
            steps{
                sh 'docker compose down'
                sh 'docker compose up -d db'
                sh 'sleep 5'
            }
        }  
        stage('Apply Schema'){
            steps{
                sh 'docker compose exec -T db psql -U unsungheroes_app -d unsungheroes -f /schema.sql'
            }
        }  
        stage('Deploy'){
            steps{
                sh 'docker compose up -d'
            }
        }
        stage('Run Tests'){
            steps{
                 sh '''
                    sleep 3
                    curl -sf http://localhost/health
                    curl -sf http://localhost/api/wars > /dev/null
                    echo "Smoke test passed."
                '''
            }
        }
        stage('Cleanup'){
            steps{
                sh 'docker image prune -f'
            }
        }
    }
    post{
        success {echo 'Deployed Successfully!'}
        failure {echo 'Check the logs for errors!'}
    }
}