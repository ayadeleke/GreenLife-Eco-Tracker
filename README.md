[![Board Status](https://dev.azure.com/ay-alu/8cf47f15-2421-4980-b11c-72f90ffcf768/7f38c7ff-5139-48fc-a054-589023b14ffe/_apis/work/boardbadge/7c9f1aa8-bd68-45be-8c08-ea13986638b4)](https://dev.azure.com/ay-alu/8cf47f15-2421-4980-b11c-72f90ffcf768/_boards/board/t/7f38c7ff-5139-48fc-a054-589023b14ffe/Microsoft.EpicCategory)

# GreenLife-Eco-Tracker  

GreenLife Eco Tracker is a full-stack web application for tracking tree planting activities, visualizing environmental impact, and promoting biodiversity. The project features a Django REST API backend and a React/TypeScript frontend, with robust automated testing and CI/CD integration.

## 🌐 Live Applications

- **Production Environment**: [https://greenlife-tracker-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io/](https://greenlife-tracker-prod.greenplant-30488afa.southcentralus.azurecontainerapps.io/)
- **Staging Environment**: [https://greenlife-tracker.greenplant-30488afa.southcentralus.azurecontainerapps.io/](https://greenlife-tracker.greenplant-30488afa.southcentralus.azurecontainerapps.io/)
- **Monitoring Dashboard**: [UptimeRobot Status Page](https://stats.uptimerobot.com/qXpOxvk5CE)
- **Video Demonstration**: [https://youtube.com/watch?v=your-video-id](https://youtube.com/watch?v=your-video-id)

## 🚀 CI/CD Pipeline

This project implements a complete CI/CD pipeline with:
- **Automated Testing**: Backend (Django) and Frontend (React) test suites
- **Security Scanning**: Dependency vulnerability scanning (Safety, pip-audit), static code analysis (Bandit), container image scanning (Trivy)
- **Infrastructure as Code**: Terraform for Azure resource provisioning
- **Multi-Environment Deployment**: Automated staging deployment on `develop` branch, production deployment on `main` branch with manual approval
- **DevSecOps Integration**: Security checks integrated into every deployment
- **Real-time Monitoring**: UptimeRobot monitoring with instant incident alerts and downtime notifications

---

## 🌱 Project Description

GreenLife Eco Tracker enables users to:
- Register and log in securely
- Add and view trees they have planted, including species and location
- Visualize tree data on an interactive map
- View personal and community statistics (total trees, species diversity, etc.)
- See species breakdowns and trends

The project is designed with professional software engineering practices, including:
- Issue tracking and project planning via GitHub Projects
- Secure repository setup with branch protection and required reviews
- Automated CI/CD pipeline with comprehensive testing and security scanning
- Clean, modular codebase with comprehensive unit tests

---

## 🚀 Local Setup Instructions

### Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (or SQLite for local dev)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```sh
git clone https://github.com/ayadeleke/greenlife-eco-tracker.git
cd greenlife-eco-tracker
```

### 2. Backend Setup

```sh
cd greenlife-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Edit .env as needed
python manage.py migrate
python manage.py createsuperuser  # Optional, for admin access
python manage.py runserver
```

### 3. Frontend Setup

```sh
cd ../greenlife-frontend
npm install
npm start
```

- The frontend will run on [http://localhost:5173](http://localhost:5173)
- The backend API will run on [http://localhost:8000](http://localhost:8000)

---

## 🧪 Running Tests

### Backend

```sh
cd greenlife-backend
python manage.py test
```

### Frontend

```sh
cd greenlife-frontend
npm test
```

---

## 🚀 Local Setup Instructions (Docker-Based)
### Prerequisites
- In addition to the above stated prerequisites, the following I required to run this project base on Docker:
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)
- [Redis](https://redis.io/download) (optional, for caching)

#### 1. Clone the Repository

```sh
git clone https://github.com/ayadeleke/greenlife-eco-tracker.git
```

#### 2. Set up Environment Variables

```sh
# Create an environment variable at the root of the project using the .example in the project
echo .env
# Copy environment configuration
cp .env.example .env

# Edit the .env file with your configuration
# For Docker setup, you can use the default values
```

#### 3. Run with Docker Compose

```sh
# Start all services (backend + frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

#### 4. Database Setup (If this is your first time running this project)

##### NOTE: For this project I used MySQL but you are free to use any database of your choice

```sh
# Run database migrations
docker-compose exec backend python manage.py makemigrations &&
docker-compose exec backend python manage.py migrate

# Create a superuser (optional)
docker-compose exec backend python manage.py createsuperuser
```
#### Local Setup Instructions (Docker-Based)
##### Using Pre-built Images from Docker Hub

###### Running Containers Independently

```sh
# 1. Pull the images from Docker Hub
docker pull aytreasure/greenlife-backend:latest
docker pull aytreasure/greenlife-frontend:latest

# 2. Run the backend container
docker run -d \
  --name greenlife-backend \
  --env-file .env \
  -p 8000:8000 \
  aytreasure/greenlife-backend:latest

# 3. Run the frontend container
docker run -d \
  --name greenlife-frontend \
  --env-file .env \
  -p 3000:80 \
  aytreasure/greenlife-frontend:latest

# 4. Check running containers
docker ps
```

---

## Screenshots
![image](https://github.com/user-attachments/assets/f5cf990c-efd4-40ae-bc96-bad7e0dd87be)

![image](https://github.com/user-attachments/assets/dec0ebf6-7f75-4630-a06e-587087cd56a1)

---

## 🛠️ Continuous Integration

- All Pull Requests trigger the CI pipeline (GitHub Actions).
- The pipeline lints code and runs all unit tests.
- Branch protection rules require PR review and passing status checks before merging to `main`.

---

## 📋 Project Management

- [Azure Project Board](https://dev.azure.com/ay-alu/GreenLife%20Eco%20Tracker/_boards/board/t/GreenLife%20Eco%20Tracker%20Team/Epics)  
  Tracks all user stories, tasks, and milestones.  
  Issues are linked to PRs and moved across columns as work progresses.

---

## 📁 Directory Structure

```
greenlife-eco-tracker/
├── greenlife_backend/       # Django REST API
│   ├── Dockerfile          # Backend container configuration
│   ├── requirements.txt    # Python dependencies
│   ├── manage.py          # Django management script
│   ├── config/            # Django settings and configuration
│   └── tracker/           # Main application logic
├── greenlife-frontend/     # React/TypeScript frontend
│   ├── Dockerfile         # Frontend container configuration
│   ├── nginx.conf         # Nginx configuration for production
│   ├── package.json       # Node.js dependencies
│   ├── src/               # React source code
│   └── public/            # Static assets
├── terraform/             # Infrastructure as Code
│   └── main.tf           # Azure resource definitions
├── .github/               # GitHub Actions workflows
│   └── workflows/        # CI/CD pipeline definitions
├── docker-compose.yml     # Multi-container orchestration
├── .env.example          # Environment variables template
├── phase.md              # Project phase completion report
└── README.md             # Project documentation
```

---

## 🤝 Contributing

1. Fork the repo and create your feature branch (`git checkout -b feature/YourFeature`)
2. Commit your changes with clear messages
3. Push to the branch and open a Pull Request
4. Link your PR to the relevant issue/task on the Project Board

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Authors

- [Ayotunde Adeleke](https://github.com/ayadeleke)
- [Contributors](https://github.com/ayadeleke/greenlife-eco-tracker/graphs/contributors)

---

## 📞 Support

For questions or support, please open an issue on [GitHub Issues](https://github.com/ayadeleke/greenlife-eco-tracker/issues).

---

## 🧹 Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to enforce code quality and formatting.

To install locally:

```sh
pip install pre-commit
pre-commit install
```