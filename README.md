# Transaction Logger

A microservices-based application for tracking and managing financial transactions. The application consists of a React frontend, Node.js backend, and PostgreSQL database, all containerized and orchestrated with Kubernetes.

## Project Structure

```
.
├── docker-compose.yaml          # Local development setup
├── K8s_deployment/             # Kubernetes deployment configurations
├── transaction_backend/        # Node.js backend service
└── transaction_frontend/       # React frontend application
```

## Prerequisites

- Docker and Docker Compose
- Minikube
- kubectl CLI tool
- Node.js v16 or higher
- npm or yarn

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Omared250/TransactionLogger.git
cd TransactionLogger
```

2. Create configuration file:
```bash
cp K8s_deployment/01-config.example.yaml K8s_deployment/01-config.yaml
```

3. Edit `K8s_deployment/01-config.yaml` with your database credentials and configuration.

4. Build the Docker images:
```bash
# Build backend
cd transaction_backend
docker build -t my-backend:latest .

# Build frontend
cd ../transaction_frontend
docker build -t my-frontend:latest .
```

5. For local development with Docker Compose:
```bash
docker-compose up -d
```

### Managing Docker Compose Services

#### Starting and Stopping Containers

To start your application:
```bash
# Start in foreground (with logs)
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# View logs while running in detached mode
docker-compose logs -f
```

To stop your application:
```bash
# Pause containers (keeps containers, volumes, and networks)
docker-compose stop

# Complete cleanup (removes containers, networks)
docker-compose down

# Complete cleanup including volumes (⚠️ This will delete your database data)
docker-compose down -v
```

The difference between `stop` and `down`:
- `stop`: Pauses containers (like putting your computer to sleep)
- `down`: Removes containers and networks (like shutting down your computer)

Note: Using `down` is safe for your data unless you add the `-v` flag.

## Kubernetes Deployment with Minikube

1. Start Minikube:
```bash
minikube start
```

2. Configure Docker to use Minikube's Docker daemon:
```bash
eval $(minikube -p minikube docker-env)
```

3. Build the Docker images (make sure you're in the project root):
```bash
# Build backend
cd transaction_backend
docker build -t my-backend:latest .

# Build frontend
cd ../transaction_frontend
docker build -t my-frontend:latest .
```

4. Apply the Kubernetes configurations in order:
```bash
kubectl apply -f K8s_deployment/01-config.yaml
kubectl apply -f K8s_deployment/02-database.yaml
kubectl apply -f K8s_deployment/03-backend.yaml
kubectl apply -f K8s_deployment/04-frontend.yaml
```

5. Verify the deployments:
```bash
kubectl get pods
kubectl get services
```

6. In a separate terminal window, run the Minikube tunnel to enable LoadBalancer services:
```bash
sudo minikube tunnel
```
This command needs to keep running to maintain access to the services. Keep this terminal window open.

7. Now you can access the services through localhost. The frontend service will be available at:
```bash
http://localhost:80
```

Note: The `eval $(minikube -p minikube docker-env)` command configures your terminal to use Minikube's Docker daemon instead of your local one. This is necessary because Kubernetes needs to access the images we build. You'll need to run this command in any new terminal window where you want to build images for Minikube.

Important: The `minikube tunnel` command requires sudo privileges and must keep running in a separate terminal window to maintain access to the LoadBalancer services through localhost.

## Application Components

### Frontend (React)
- Located in `transaction_frontend/`
- Features:
  - Dashboard with transaction overview
  - Daily and Monthly reports
  - User-based transaction tracking

### Backend (Node.js)
- Located in `transaction_backend/`
- REST API endpoints for:
  - Transaction CRUD operations
  - Report generation
  - User management

### Database (PostgreSQL)
- Persistent storage for transactions
- User data management
- Secured with Kubernetes secrets

## Configuration

### Environment Variables

Create a copy of the example configuration:
```bash
cp K8s_deployment/01-config.example.yaml K8s_deployment/01-config.yaml
```

Required variables:
- `POSTGRES_USER`: Database username
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `POSTGRES_HOST`: Database host (default: postgres-service)
- `POSTGRES_PORT`: Database port (default: 5432)
- `APP_PORT`: Backend application port (default: 4000)

## Security Considerations

1. Never commit the `01-config.yaml` file (it's in .gitignore)
2. Always use specific versions for container images
3. Set resource limits and requests for all containers
4. Implement network policies for pod-to-pod communication
5. Use liveness and readiness probes for better reliability

## Monitoring and Maintenance

- Use `kubectl logs` to view container logs
- Monitor resource usage with `kubectl top`
- Regular backup of PostgreSQL data
- Keep container images updated for security patches

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Cleanup Procedures

### Docker Compose Cleanup
To completely stop and remove all Docker Compose resources:
```bash
# Stop and remove containers, networks (preserves volumes)
docker-compose down

# To also remove volumes (⚠️ This will delete your database data)
docker-compose down -v
```

### Minikube Cleanup
When you're done with Minikube, follow these steps:

1. Stop the minikube tunnel process:
```bash
# Press Ctrl+C in the terminal running the tunnel
```

2. Delete all Kubernetes resources:
```bash
kubectl delete -f .
```

3. Stop Minikube:
```bash
minikube stop
```

4. Reset Docker environment:
```bash
# Un-set the Docker environment variable to use your local Docker again
eval $(minikube -p minikube docker-env -u)
```

Optional: To completely remove Minikube and reclaim disk space:
```bash
minikube delete
```
