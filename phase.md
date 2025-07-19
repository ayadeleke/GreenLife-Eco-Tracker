# GreenLife Eco Tracker - Phase Completion Report

## Project Overview

This document details the progress in the development of the **GreenLife Eco Tracker** project app, it includes the completion of containerization, Infrastructure as Code (IaC), and manual cloud deployment requirements as required by the second phase of the project based on the azure workflow board.

## **1. Manual Cloud Deployment**

After a successful deployment of the project on azure web service, the frontend and backend of the project were deployed independently for easier management and troubleshooting

### **Live Application URLs**
- **Backend API**: [https://greenlifebackendapi.azurewebsites.net](https://greenlifebackendapi.azurewebsites.net)
- **Frontend Application**: [https://greengoal.azurewebsites.net](https://greengoal.azurewebsites.net)

### **Azure App Services Deployment**

### **Container Registry Architecture**
- **Registry**: Azure Container Registry (ACR)
- **Image Storage**: Secure, private container image repository
- **Deployment Strategy**: 
  - Build Docker images from the Azure cli
  - Push images to ACR with with tag
  - Deploy containers to Azure App Service
  - Automatic image updates on new deployments

#### **Backend Deployment**
- **Service Name**: `Greenlifebackend`
- **Deployment Method**: Azure Container Registry + Azure App Service (Container)
- **Features**:
  -  Docker containerization with multi-stage builds to reduce the size of the image
  -  Azure Container Registry (ACR) for image storage
  -  Python 3.11-alpine runtime environment
  -  Environment variable configuration for the backend on Azure web service
  -  Container-based deployment with Azure App Service

#### **Frontend Deployment**
- **Service Name**: `Greenlifefrontend`
- **Deployment Method**: Azure Container Registry + Azure App Service (Container)
- **Features**:
  -  Docker containerization with Nginx serving
  -  Azure Container Registry (ACR) for image storage
  -  Node.js 20.x build environment
  -  Environment-specific API URL configuration

#### **Continuous Integration** (`ci.yml`)
-  Automated linting (flake8 for Python, ESLint for React)
-  Code formatting validation (Black for Python)
-  Security scanning (Bandit for Python)
-  Unit test execution
-  Multi-branch trigger support (main, develop)

---

## **2. Peer Review Process**

### **Pull Request Review Implementation**
- **Repository**: [GreenLife-Eco-Tracker](https://github.com/ayadeleke/GreenLife-Eco-Tracker)
- **Review Process**: The process aimed at ensuring the following:
  -  Branch protection rules enforcing PR reviews
  -  Required status checks before merge
  -  Automated CI pipeline validation
  -  Code quality and security scanning

### **Testing Infrastructure**
- **Backend Testing**: Django unit tests with 100% coverage
- **Frontend Testing**: React Testing Library with Vitest
- **Cache Testing**: Redis connectivity and performance tests
- **Integration Testing**: End-to-end API testing

### **Security Implementation**
- **Authentication**: JWT-based authentication system
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **Security Scanning**: Automated vulnerability detection

---

## 3 **Deployment Screenshots**

### **Azure Resource Groups**
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/project_documentation/screenshots/resource%20group.png?raw=true)

### **Azure Container Registry**
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/project_documentation/screenshots/ACR.png?raw=true)

### **App Services Running**
- **Backend**:
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/project_documentation/screenshots/Backend%20Web%20App.png?raw=true)

- **Frontend**:
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/a8c64e464472db27441d5ec31c540b44e9bdbf7d/screenshots/Frontend%20Web%20App.png)

### **Terraform Cloud Workspace**
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/709ec4f0b493dbaab8e7e417d20c84fa545898c7/screenshots/Terraform%20Cloud%20Resources.png)

### **Docker Hub Library**
![image](https://github.com/ayadeleke/GreenLife-Eco-Tracker/blob/project_documentation/screenshots/Docker%20hub%20registry.png?raw=true)

---

## 4 **Challenges and Reflections**

### **Infrastructure as Code Challenges**
   - One of the challenges faced with the IaC is the need for the remote state management. I was a bit of challenge having to configure the cloud to accept the state plan as it was the first time of trying the process. However, through the help of provided resources, I was able to navigate through the challenge.

   -  Another challenge face was the requirement of Azure for a global unique names, this was not known at first and i was getting errors until I started adding random numbers as suffix to some of the resources and some i had to settle for close to meaning name for the resources like for the frontend. I had to settle for **greengoal** as other close names to **greenlife** are not available.

### **Manual Deployment Process Insights**

   - Manual Deployment on Azure requires a very meticulous attention. I was at first trying to deploy through GitHub but was later found ou that deploying through docker images manually seems to be easier until i learn how to deploy automatically.

   - Another manual Deployment challenge was the setup of the environment variables and secret variable. If these are not properly provisioned. the whole process will be faulted.

   - The need to plan for rollback and downtime recovery can not be overemphasized in manual deployment on Azure as many things can go wrong swiftly, from wrong naming of resources to trailing white space in setting variable and many more.

---

## 🔗 **Resource Links**

- **Live Application**: [https://greengoal.azurewebsites.net](https://greengoal.azurewebsites.net)
- **API Documentation**: [https://greenlifebackendapi.azurewebsites.net](https://greenlifebackendapi.azurewebsites.net)
- **GitHub Repository**: [https://github.com/ayadeleke/GreenLife-Eco-Tracker](https://github.com/ayadeleke/GreenLife-Eco-Tracker)
- **Project Board**: [Azure DevOps Board](https://dev.azure.com/ay-alu/GreenLife%20Eco%20Tracker/_boards/board/t/GreenLife%20Eco%20Tracker%20Team/Epics)

---

**Project Completed By**: Ayotunde Adeleke
**Date**: July 17, 2025
**Phase**: Infrastructure & Deployment Phase - 2
