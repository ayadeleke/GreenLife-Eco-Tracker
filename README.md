[![Board Status](https://dev.azure.com/ay-alu/8cf47f15-2421-4980-b11c-72f90ffcf768/7f38c7ff-5139-48fc-a054-589023b14ffe/_apis/work/boardbadge/7c9f1aa8-bd68-45be-8c08-ea13986638b4)](https://dev.azure.com/ay-alu/8cf47f15-2421-4980-b11c-72f90ffcf768/_boards/board/t/7f38c7ff-5139-48fc-a054-589023b14ffe/Microsoft.EpicCategory)

# GreenLife-Eco-Tracker  

GreenLife Eco Tracker is a full-stack web application for tracking tree planting activities, visualizing environmental impact, and promoting biodiversity. The project features a Django REST API backend and a React/TypeScript frontend, with robust automated testing and CI/CD integration.

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
- Automated CI pipeline for linting and testing
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

## 🛠️ Continuous Integration

- All Pull Requests trigger the CI pipeline (GitHub Actions).
- The pipeline lints code and runs all unit tests.
- Branch protection rules require PR review and passing status checks before merging to `main`.

---

## 📋 Project Management

- [GitHub Project Board](https://github.com/ayadeleke/greenlife-eco-tracker/projects/1)  
  Tracks all user stories, tasks, and milestones.  
  Issues are linked to PRs and moved across columns as work progresses.

---

## 📁 Directory Structure

```
greenlife-eco-tracker/
├── greenlife-backend/    # Django REST API
├── greenlife-frontend/   # React/TypeScript frontend
├── .github/              # GitHub Actions workflows
├── README.md
└── ...
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
