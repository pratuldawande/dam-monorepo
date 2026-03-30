# DAM Monorepo

## Docker

This repo includes a Docker Compose stack for:

- `backend`: Node.js API and asset worker
- `nginx`: serves the React build and reverse proxies `/api`
- `mongo`: MongoDB
- `rabbitmq`: queue broker
- `minio`: object storage

### Run

1. Copy `.env.docker.example` to `.env` if you want to override defaults.
2. Start the stack:

```bash
docker compose up --build
```

### Endpoints

- App: `http://localhost`
- API via Nginx: `http://localhost/api`
- MinIO console: `http://localhost:9002`
- RabbitMQ console: `http://localhost:15673`

Uploaded asset URLs are routed through Nginx using `/storage/...`, so the browser can access MinIO objects without depending on Docker-internal hostnames.
