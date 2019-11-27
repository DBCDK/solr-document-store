if (env.BRANCH_NAME == 'master') {
    properties([
        disableConcurrentBuilds(),
        pipelineTriggers([
            triggers: [
                [
                    $class: 'jenkins.triggers.ReverseBuildTrigger',
                    upstreamProjects: "../pg-queue/master, dbc-commons, Docker-postgres-bump-trigger, Docker-payara5-bump-trigger", threshold: hudson.model.Result.SUCCESS
                ]
    	    ]
        ]),
    ])
}
pipeline {
    agent { label "devel8" }
    tools {
        maven "maven 3.5"
    }
    environment {
        MAVEN_OPTS = "-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
    }
    triggers {
        pollSCM("H/3 * * * *")
    }
    options {
        buildDiscarder(logRotator(artifactDaysToKeepStr: "", artifactNumToKeepStr: "", daysToKeepStr: "30", numToKeepStr: "30"))
        timestamps()
    }
    stages {
        stage("build") {
            steps {
                // Fail Early..
                script {
                    if (! env.BRANCH_NAME) {
                        currentBuild.rawBuild.result = Result.ABORTED
                        throw new hudson.AbortException('Job Started from non MultiBranch Build')
                    } else {
                        println(" Building BRANCH_NAME == ${BRANCH_NAME}")
                    }
                }

                sh """
                    rm -rf \$WORKSPACE/.repo/dk/dbc
                    mvn -B -Dmaven.repo.local=\$WORKSPACE/.repo clean
                    mvn -B -Dmaven.repo.local=\$WORKSPACE/.repo org.jacoco:jacoco-maven-plugin:prepare-agent install javadoc:aggregate -Dsurefire.useFile=false
                """
                script {
                    junit testResults: '**/target/surefire-reports/TEST-*.xml'

                    def java = scanForIssues tool: [$class: 'Java']
                    def javadoc = scanForIssues tool: [$class: 'JavaDoc']

                    publishIssues issues:[java,javadoc], unstableTotalAll:1
                }
            }
        }

        stage("analysis") {
            steps {
                sh """
                    mvn -B -Dmaven.repo.local=\$WORKSPACE/.repo -pl !gui pmd:pmd pmd:cpd findbugs:findbugs
                """

                script {
                    def pmd = scanForIssues tool: [$class: 'Pmd'], pattern: '**/target/pmd.xml'
                    publishIssues issues:[pmd], unstableTotalAll:1

                    def cpd = scanForIssues tool: [$class: 'Cpd'], pattern: '**/target/cpd.xml'
                    publishIssues issues:[cpd]

                    def findbugs = scanForIssues tool: [$class: 'FindBugs'], pattern: '**/target/findbugsXml.xml'
                    publishIssues issues:[findbugs], unstableTotalAll:1
                }
            }
        }

        stage("coverage") {
            steps {
                step([$class: 'JacocoPublisher', 
                      execPattern: '**/target/*.exec',
                      classPattern: '**/target/classes',
                      sourcePattern: '**/src/main/java',
                      exclusionPattern: '**/src/test*'
                ])
            }
        }

        stage('Docker') {
            steps {
                script {
                    if (! env.CHANGE_BRANCH) {
                        imageLabel = env.BRANCH_NAME
                    } else {
                        imageLabel = env.CHANGE_BRANCH
                    }
                    if ( ! (imageLabel ==~ /master|trunk/) ) {
                        println("Using branch_name ${imageLabel}")
                        imageLabel = imageLabel.split(/\//)[-1]
                        imageLabel = imageLabel.toLowerCase()
                    } else {
                        println(" Using Master branch ${BRANCH_NAME}")
                        imageLabel = env.BUILD_NUMBER
                    }

                    def dockerFiles = findFiles(glob: '**/target/docker/Dockerfile')
                    def version = readMavenPom().version.replace('-SNAPSHOT', '')

                    for (def dockerFile : dockerFiles) {
                        def dirName = dockerFile.path.replace('/target/docker/Dockerfile', '')
                        dir(dirName) {
                            def modulePom = readMavenPom file: 'pom.xml'
                            def projectArtifactId = modulePom.getArtifactId()
                            def imageName = "${projectArtifactId}-${version}".toLowerCase()
                            println("In ${dirName} build ${projectArtifactId} as ${imageName}:$imageLabel")
                            def app = docker.build("$imageName:${imageLabel}", "--pull --file target/docker/Dockerfile .")

                            if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                                docker.withRegistry('https://docker-os.dbc.dk', 'docker') {
                                    app.push()
                                    if (env.BRANCH_NAME ==~ /master|trunk/) {
                                        app.push "latest"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage("upload") {
            steps {
                script {
                    if (env.BRANCH_NAME ==~ /master|trunk/) {
                        sh """
                            mvn -Dmaven.repo.local=\$WORKSPACE/.repo jar:jar deploy:deploy
                        """
                    }
                }
            }
        }
    }
    post {
        failure {
            script {
                if ("${env.BRANCH_NAME}" == 'master') {
                    emailext(
                            recipientProviders: [developers(), culprits()],
                            to: "os-team@dbc.dk",
                            subject: "[Jenkins] ${env.JOB_NAME} #${env.BUILD_NUMBER} failed",
                            mimeType: 'text/html; charset=UTF-8',
                            body: "<p>The master build failed. Log attached. </p><p><a href=\"${env.BUILD_URL}\">Build information</a>.</p>",
                            attachLog: true,
                    )
                    slackSend(channel: 'search',
                            color: 'warning',
                            message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed and needs attention: ${env.BUILD_URL}",
                            tokenCredentialId: 'slack-global-integration-token')

                } else {
                    // this is some other branch, only send to developer
                    emailext(
                            recipientProviders: [developers()],
                            subject: "[Jenkins] ${env.BUILD_TAG} failed and needs your attention",
                            mimeType: 'text/html; charset=UTF-8',
                            body: "<p>${env.BUILD_TAG} failed and needs your attention. </p><p><a href=\"${env.BUILD_URL}\">Build information</a>.</p>",
                            attachLog: false,
                    )
                }
            }
        }
        success {
            step([$class: 'JavadocArchiver', javadocDir: 'target/site/apidocs', keepAll: false])
        }
    }
}
