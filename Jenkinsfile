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

        stage('Docker') {
            steps {
                script {
                    def allDockerFiles = findFiles glob: '**/Dockerfile'
                    def dockerFiles = allDockerFiles.findAll { f -> !f.path.startsWith("docker") }
                    pom = readMavenPom file: 'pom.xml'

                    for (def f : dockerFiles) {
                        def dirName = f.path.take(f.path.length() - 11)
                        def projectName = f.path.substring(0, f.path.indexOf('/'))

                        dir(dirName) {
                            def imageName = "solr-doc${projectName}-${pom.version}".toLowerCase()
                            def imageLabel = env.BUILD_NUMBER
                            if ( ! (env.BRANCH_NAME ==~ /master|trunk/) ) {
                                println("Using branch_name ${BRANCH_NAME}")
                                imageLabel = BRANCH_NAME.split(/\//)[-1]
                                imageLabel = imageLabel.toLowerCase()
                            } else {
                                println(" Using Master branch ${BRANCH_NAME}")
                            }

                            println("In ${dirName} build ${projectName} as ${imageName}:$imageLabel")
                            sh 'rm -f *.war ; cp  ../../../target/*.war .'
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