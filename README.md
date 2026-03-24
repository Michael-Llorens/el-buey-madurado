
# 🥩 El Buey Madurado  
### Restaurant Management System — Full Stack Web Application

<p align="center">
  <a href="https://restaurante-el-buey-madurado.vercel.app">
    <img src="https://img.shields.io/badge/Live-Demo-00c853?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
  <img src="https://img.shields.io/github/actions/workflow/status/Michael-Llorens/el-buey-madurado/ci.yml?style=for-the-badge&label=CI&logo=github"/>
  <img src="https://img.shields.io/github/last-commit/Michael-Llorens/el-buey-madurado?style=for-the-badge"/>
  <img src="https://img.shields.io/github/license/Michael-Llorens/el-buey-madurado?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs"/>
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
</p>

---

## 📌 Overview

**El Buey Madurado** is a full-stack web application designed for complete restaurant management.  
It includes product control, ingredients, tables, orders, and user authentication, with a fully automated deployment pipeline and reproducible Docker environment.

**Author:** Michael Llorens Barbera  
**Course:** Web Application Deployment (2º DAW)  
**Repository:** https://github.com/Michael-Llorens/el-buey-madurado  

---

## 🚀 Live Demo

🌐 https://restaurante-el-buey-madurado.vercel.app  

---

## ✨ Features

- 🔐 Secure authentication with **NextAuth (JWT)**
- 📦 Full CRUD for products and ingredients
- 🍽 Table and order management
- 🖼 Image upload via **Cloudinary**
- 📱 Fully responsive UI
- 🐳 Reproducible **Docker** development environment
- 🚀 Automated **CI/CD pipeline**
- 🔒 Secure environment variables & secrets
- 🌿 Protected production branch

---

## 🧱 Architecture

| Environment | Branch | Platform | Database |
|------------|--------|----------|----------|
| Development | `develop` | Docker | MongoDB (container) |
| Staging | `develop` | Vercel Preview | MongoDB Atlas |
| Production | `main` | Vercel | MongoDB Atlas |

**Deployment Flow**

Local (Docker) → develop → Pull Request → main → Automatic Deploy (Vercel)

---

## 🛠 Tech Stack

### Frontend / Backend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js

### Database
- MongoDB + Mongoose
- MongoDB Atlas (production)

### DevOps & Deployment
- Docker + Docker Compose
- GitHub (version control)
- GitHub Actions (CI)
- Vercel (CD & Hosting)
- Cloudinary (Image storage)

---

## 🐳 Local Development (Docker)

### ▶ Run project

docker-compose up -d --build

### Access

- App → http://localhost:3000  
- Mongo Express → http://localhost:8081  
- MongoDB → mongodb://localhost:27017  

### Stop containers

docker-compose down

### Reset database

docker-compose down -v

---

## 🔐 Environment Variables

See `.env.example`

MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Secrets are stored securely in:

- Vercel Environment Variables
- GitHub Actions Secrets
- `.env.docker` (local only)

---

## 🔄 CI/CD Pipeline

### Continuous Integration — GitHub Actions

Runs on:

- Push to `develop`
- Pull Request → `main`

Checks:

- Dependency install
- TypeScript validation
- Production build

If CI fails → merge is blocked.

---

### Continuous Deployment — Vercel

Trigger:

Push to main → Automatic deployment

Includes:

- Preview deployments for Pull Requests
- Automatic HTTPS & CDN
- Rollback support
- ~60s deployment time

---

## 🌿 Git Workflow

main → Production (protected)  
develop → Development  

Rules:

- No direct push to `main`
- Only via Pull Request
- CI must pass before merge

---

## 📁 Project Structure

.github/workflows/ci.yml    # CI pipeline  
src/                        # Application source  
docker-compose.yaml         # Docker environment  
Dockerfile.dev              # Dev container  
.env.example                # Environment template  
README.md                   # Documentation  

---

## 🧪 Testing & Verification

- Docker containers running correctly
- MongoDB persistence verified
- CRUD operations fully functional
- CI pipeline passing
- Automatic deployment working
- Production accessible via HTTPS
- Branch protection enforced

---

## 🔒 Security

- No secrets stored in repository
- Environment variables isolated per environment
- Production branch protected
- Secure authentication via JWT
- HTTPS enabled by default (Vercel)

---

## ⚙️ Useful Commands

### Docker

docker-compose up -d --build  
docker-compose logs -f app  
docker-compose restart mongodb  
docker-compose down -v  

### Git

git checkout develop  
git pull origin develop  
git push origin develop  

---

## ☁️ Technical Decisions

- Docker → reproducible and isolated environment  
- Vercel → native Next.js deployment & automation  
- MongoDB Atlas → managed production database  
- Simplified Git Flow → main / develop strategy  
- Azure not used → module not taken (project adaptation)  

---

## 🚧 Future Improvements

- Automated testing
- Lint integration in CI
- Monitoring (Sentry / Analytics)
- Custom domain
- Dedicated staging environment

---

## 🤝 Contributing

This is an academic project, but contributions are welcome.

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes  
4. Open a Pull Request  

---

## 📜 License

Educational project — academic use.

---

## 👨‍💻 Author

**Michael Llorens Barbera**  
2º DAW — Web Application Deployment  

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
