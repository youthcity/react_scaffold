#!/usr/bin/env groovy
// vim: set ts=2 sts=2 sw=2 expandtab:
// Jenkins CI Imperative Build Script for Whitepaw
// TODO: This should be migrated to a Declarative Pipeline as soon as
//       Docker Builds have declarative steps.

// Project Settings (as globals)
projectName = "whitepaw"
branchName = "${env.BRANCH_NAME}".replaceAll("/","__")
buildVersion = "${branchName}-${env.BUILD_NUMBER}"
deployPlaybook = 'playbooks/whitepaw.yml'

// URLs, for messages, prompts and notifications
stagingUrl = "https://staging-frontend.codemao.cn/"
productionUrl = "https://lab.codemao.cn/"

// Hosts and Credentials
def dockerHost = 'tcp://127.0.0.1:2376'
def dockerCreds = 'docker-host'
def dockerRegistry = 'https://registry.srv.codemao.cn:5000'
def registryCreds = 'c0b0fc13-6944-40b1-a03e-77a1afed2b17'
def gitCreds = 'e1eb7443-869e-4118-a423-01796e29ea1a'

// Ansible Vault credentials, for deployment
def stagingVaultCreds = 'ansible-vault-staging'
def productionVaultCreds = 'ansible-vault-production'

// Shared serializable objects
def currentImage

// Checkout and build project
node {
  stage('Checkout code from SCM') {
    // Checkout current revision
    checkout scm

    // Also check out submodules
    sshagent([gitCreds]) {
      sh 'git submodule update --init --recursive'
    }
  }

  stage('Build Docker Image') {
    docker.withServer(dockerHost, dockerCreds) {
      currentImage = docker.build("${projectName}:${buildVersion}", "--pull .")
      stage('Push build to Registry') {
        docker.withRegistry(dockerRegistry, registryCreds) {
            currentImage.push()
        }
      }  
    }
  }
}

// Master branch is stable, assume staging -> production pipeline
// FIXME: Using the refactor branch as stable until merged to master.
if(branchName == "feature__refactor") {

  stage("Deploy build to staging") {
    // Acquire lock on staging server during tagging and deploy.
    // This prevents concurrent builds from clobbering each other.
    lock('staging_server_whitepaw') {
      echo "Build is master branch, tagging as 'latest'"

      // Alocate node for operations
      node {
        docker.withServer(dockerHost, dockerCreds) {
          docker.withRegistry(dockerRegistry, registryCreds) {
            currentImage.push "latest"
          }
        }
        // Call deployment job with ansible parameters
        deploy('staging', stagingVaultCreds)
      }
      // Wait for QA Approval, this must be done outside node allocations
      // as to not hang both the flyweight executor and node executor.
      stage("Approve build for Production") {
        input message: "Deploy build on ${stagingUrl} to production?", submitter: "approver"
      }
    }
  }

  // If approval went through, promote the build to production
  stage("Deploy build to production") {
    lock('production_server_whitepaw') {
      // Alocate node for operations
      node {
        docker.withServer(dockerHost, dockerCreds) {
          docker.withRegistry(dockerRegistry, registryCreds) {
            echo "Build promoted, tagging as 'production'"
            currentImage.push "production"
          }
        }
        // Call deployment job with ansible parameters
        deploy('production', productionVaultCreds)
      }
    }
  }
} else {
  // Build is just a feature branch build, tag it as latest in its series
  stage("Tag as latest in branch") {
    node {
      docker.withServer(dockerHost, dockerCreds) {
        docker.withRegistry(dockerRegistry, registryCreds) {
          echo "Tagging ${projectName}:${buildVersion} as ${branchName}"
          currentImage.push "${branchName}"
        }
      }
    }
  }
}

// Deployment method, exfiltrated here for cleaner logic.
// This could (and probably should) be moved to a shared groovy lib
// FIXME: Man this is really gross looking.
def deploy(String inventory, String vaultCreds) {
  withCredentials([string(credentialsId: vaultCreds, variable: 'ANSIBLE_VAULT_PASSPHRASE')]) {
    build job: 'ansible-deploy', parameters: [string(name: 'ANSIBLE_INVENTORY', value: inventory), password(name: 'ANSIBLE_VAULT_PASSPHRASE', value: "${env.ANSIBLE_VAULT_PASSPHRASE}"), string(name: 'ANSIBLE_PLAYBOOK', value: deployPlaybook)]
  }

  // Notify Slack channel of deployment
  timeout(60) {
    if(inventory == "production") {
      slackSend color: "good", message: "${projectName}: Build ${buildVersion} has been promoted to production and deployed to ${productionUrl}."
    } else if (inventory == "staging") {
      slackSend color: "warning", message: "${projectName}: Build ${buildVersion} has been deployed to staging at ${stagingUrl}."
    } else {
      slackSend color: "warning", message: "${projectName}: Build ${buildVersion} has been deployed to ${inventory}."
    }
  }
}
