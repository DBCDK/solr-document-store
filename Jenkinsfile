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
                    mvn -B clean
                    mvn -B verify pmd:pmd javadoc:aggregate                   
                """
                //junit "**/target/surefire-reports/TEST-*.xml,**/target/failsafe-reports/TEST-*.xml"
            }
        }

        stage("sonarqube") {
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
                    mvn clean \
                        org.jacoco:jacoco-maven-plugin:prepare-agent \
                        verify \
                        -Dmaven.test.failure.ignore=false

                    mvn sonar:sonar \
                        -Dsonar.host.url=http://sonarqube.mcp1.dbc.dk
                        -Dsonar.login=d8cfb40a9c988e2875590545628605811327660a
                        -Dsonar.branch=$BRANCH_NAME}
                """
            }
        }

        stage('Docker') {
            steps {
                script {
                    def allDockerFiles = findFiles glob: '**/Dockerfile'
                    def dockerFiles = allDockerFiles.findAll { f -> !f.path.startsWith("docker") }
                    def version = readMavenPom().version
                    

                    for (def f : dockerFiles) {
                        def dirName = f.path.take(f.path.length() - 11)


                        dir(dirName) {
                            modulePom = readMavenPom file: '../../../pom.xml'
                            def projectArtifactId = modulePom.getArtifactId()
                            if( !projectArtifactId ) {
                                throw new hudson.AbortException("Unable to find module ArtifactId in ${dirName}/../../../pom.xml remember to add a <ArtifactId> element")
                            }

                            def imageName = "${projectArtifactId}-${version}".toLowerCase()
                            def imageLabel = env.BUILD_NUMBER
                            if ( ! (env.BRANCH_NAME ==~ /master|trunk/) ) {
                                println("Using branch_name ${BRANCH_NAME}")
                                imageLabel = BRANCH_NAME.split(/\//)[-1]
                                imageLabel = imageLabel.toLowerCase()
                            } else {
                                println(" Using Master branch ${BRANCH_NAME}")
                            }

                            println("In ${dirName} build ${projectArtifactId} as ${imageName}:$imageLabel")
                            sh 'rm -f *.war ; cp  ../../../target/*.war . ; if [ -e prepare.sh ] ; then chmod +x prepare.sh ; ./prepare.sh ; fi'
                            def app = docker.build("$imageName:${imageLabel}".toLowerCase(), '--pull --no-cache .')

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
    }

}
