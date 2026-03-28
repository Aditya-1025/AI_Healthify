# Docker Setup Guide for Healthify

## Prerequisites

Make sure you have Docker and Docker Compose installed:

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version
```

If not installed, download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## Quick Start with Docker (Recommended)

### 1. Start Both Services

```bash
cd /home/testuser/Healthify
docker-compose up --build
```

This will:
- ✅ Build the backend Docker image
- ✅ Build the frontend Docker image  
- ✅ Start both services
- ✅ Connect them to the same network
- ✅ Show logs from both

### 2. Access Your Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/docs

### 3. Stop Services

```bash
docker-compose down
```

---

## Common Docker Commands

### View Running Containers

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Only backend
docker-compose logs -f backend

# Only frontend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

### Remove Images and Start Fresh

```bash
docker-compose down -v
docker-compose up --build
```

### Access Container Shell

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh
```

---

## File Structure

```
Healthify/
├── docker-compose.yml      # Orchestrates both services
├── .env.docker             # Environment variables for Docker
├── Backend/
│   ├── Dockerfile          # Backend container definition
│   ├── .dockerignore       # Files to exclude from build
│   ├── app/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── Dockerfile          # Frontend container definition
│   ├── .dockerignore       # Files to exclude from build
│   ├── package.json
│   └── .env.local
└── README.md
```

---

## How Docker Volumes Work Here

The `docker-compose.yml` mounts your local code into the containers:

```
./Backend:/app       → Backend code synced
./frontend:/app      → Frontend code synced
```

This means:
- ✅ Changes to code are reflected instantly (via --reload for backend, Vite HMR for frontend)
- ✅ You DON'T need to rebuild the image for code changes
- ✅ Only rebuild when you update dependencies

---

## Testing the API

Once containers are running:

```bash
# Test backend is working
curl http://localhost:5000/

# Test AI chat endpoint
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a fever?"}'

# Check database (inside container)
docker-compose exec backend sqlite3 healthify.db ".tables"
```

---

## Environment Variables

All variables are in `.env.docker`:

```env
GEMINI_API_KEY=your_api_key_here
```

The `docker-compose.yml` passes these to both services automatically.

---

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is taken:

```bash
# Change ports in docker-compose.yml
# For example, use 3001 and 5001 instead
```

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database Issues

```bash
# Recreate database
docker-compose down -v
docker-compose up
```

### Can't Connect to Backend from Frontend

If frontend can't reach backend, check:
```bash
# Inside frontend container
docker-compose exec frontend ping backend
```

---

## Production Deployment

For production, modify `docker-compose.yml`:

```yaml
# Remove --reload flag
# Remove localhost port bindings
# Use environment-based configuration
# Add proper health checks
# Consider using nginx as reverse proxy
```

See deployment guides for AWS, Google Cloud, or Heroku.

---

## Useful Docker Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dce='docker-compose exec'
```

---

## Next Steps

1. ✅ Run `docker-compose up --build`
2. ✅ Open http://localhost:3000
3. ✅ Register a user
4. ✅ Test the chatbot
5. ✅ Check database: `docker-compose exec backend ./venv/bin/python check_users.py`

Enjoy your containerized healthcare app! 🐳🏥
