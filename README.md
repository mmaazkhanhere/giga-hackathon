# EdgeConnect RuralNet 🚀

## **Overview**

**EdgeConnect RuralNet** is an AI-driven, real-time network simulation and optimization system designed for improving rural connectivity. It models rural networks, optimizes configurations using AI, and provides live insights via an interactive dashboard.

## **Tech Stack**

- **Backend:** Golang, Chi (REST API), gRPC (Inter-service communication), Redis (Caching)
- **Frontend:** React, Tailwind CSS, Cytoscape.js (Network visualization), WebSockets (Live updates)
- **API Gateway:** Kong (Secure API management & routing)
- **Deployment:** Docker, Fly.io / DigitalOcean / Heroku (optional)

---

## **Project Structure**

```
📂 EdgeConnect-RuralNet
├── 📂 backend
│   ├── 📂 api-gateway        # Kong API Gateway
│   │   ├── kong.yaml         # Kong declarative config
│   ├── 📂 services
│   │   ├── 📂 simulation     # Network Simulation Microservice
│   │   ├── 📂 ai-optimizer   # AI Optimization Microservice
│   ├── 📂 grpc-protos        # gRPC Protobuf Definitions
│   ├── 📂 data-store         # Redis for caching
│   ├── 📂 tests              # Backend test cases
│   ├── Dockerfile            # Backend containerization
│   ├── Makefile              # Automation
│   ├── README.md             # Backend documentation
│
├── 📂 frontend
│   ├── 📂 src
│   │   ├── 📂 components     # UI Components
│   │   ├── 📂 pages          # Dashboard Page
│   │   ├── 📂 services       # API & WebSocket handlers
│   ├── package.json
│   ├── tailwind.config.js    # Styling
│   ├── vite.config.js        # Vite Configuration
│   ├── README.md             # Frontend documentation
│
├── 📂 deployment
│   ├── fly.toml              # Fly.io deployment config
│   ├── DigitalOcean-setup.md # Cloud deployment guide
│
├── .gitignore
├── README.md
```

---

## **1️⃣ Backend Setup**

### **Prerequisites**

- Install **Golang** (`>=1.19`)
- Install **Docker**
- Install **Redis** (`optional for local caching`)

### **Run Services Locally**

```sh
git clone https://github.com/your-repo/EdgeConnect-RuralNet.git
cd EdgeConnect-RuralNet/backend

# Start Kong API Gateway
docker-compose up -d kong

# Run Network Simulation Service
go run services/simulation/main.go

# Run AI Optimization Service
go run services/ai-optimizer/main.go

# Run API Gateway
go run api-gateway/main.go
```

---

## **2️⃣ Frontend Setup**

### **Prerequisites**

- Install **Node.js** (`>=16`)
- Install **Vite** (`npm install -g vite`)

### **Run Frontend Locally**

```sh
cd frontend
npm install
npm run dev
```

Access **dashboard** at `http://localhost:5173`

---

## **3️⃣ API Gateway (Kong) Configuration**

We use **Kong in DB-less mode** for routing and security.

### **kong.yaml** (API Gateway Config)

```yaml
_format_version: "3.0"
_transform: true

services:
  - name: rest-api
    url: http://backend:8080
    routes:
      - name: rest-api-route
        paths:
          - /api
        strip_path: true

  - name: grpc-service
    url: grpc://backend:9090
    routes:
      - name: grpc-service-route
        paths:
          - /grpc
        protocols:
          - grpc
```

### **Start Kong with Config**

```sh
docker run -d --name kong \
  --network=kong-net \
  -e "KONG_DATABASE=off" \
  -e "KONG_DECLARATIVE_CONFIG=/kong/kong.yaml" \
  -v "$(pwd)/kong.yaml:/kong/kong.yaml" \
  -p 8000:8000 \
  -p 8001:8001 \
  kong/kong-gateway
```

---

## **4️⃣ Deployment**

### **Using Docker Compose**

```sh
docker-compose up -d
```

### **Deploy on Fly.io (Example)**

```sh
flyctl launch --name edgeconnect --region fra --dockerfile backend/Dockerfile
```

---

## **5️⃣ API Endpoints**

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/network/status`   | Get current network state    |
| GET    | `/api/network/ai`       | Get AI optimization logs     |
| POST   | `/api/network/scenario` | Trigger simulation scenarios |

---

## **6️⃣ Contribution Guide**

1. **Fork the Repo**
2. **Create a Feature Branch** (`git checkout -b feature-xyz`)
3. **Commit Changes** (`git commit -m "Added XYZ feature"`)
4. **Push to Branch** (`git push origin feature-xyz`)
5. **Submit a Pull Request**

---

## **7️⃣ Troubleshooting**

- **Ports Conflict?** Change ports in `docker-compose.yml`
- **Kong not routing?** Verify `kong.yaml` & restart Kong
- **Redis issues?** Ensure Redis is running (`redis-server`)

---

## **8️⃣ License**

📜 MIT License. Free to use & modify.

---

## **💡 Hackathon Goals**

✅ **AI-driven real-time network simulation**  
✅ **Dynamic optimization using gRPC & WebSockets**  
✅ **Secure & scalable API management with Kong**  
✅ **Clean, interactive frontend dashboard**  
✅ **Rapid development & cloud deployment**

🚀 **Let’s win this hackathon!** 🔥
