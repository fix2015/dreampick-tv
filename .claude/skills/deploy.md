---
name: deploy
description: Deploy dreampick-tv to AWS EC2 production server
user_invocable: true
---

# Deploy DreamPick TV

## Infrastructure

- **Domain**: https://dreampick-tv.probooking.app
- **Server**: AWS EC2 at 3.90.215.126 (us-east-1)
- **SSH**: `ssh probooking` (configured in ~/.ssh/config, user: ubuntu, key: ~/.ssh/service.pem)
- **App path on server**: /opt/dreampick-tv
- **Docker port**: 127.0.0.1:3012 → container port 80
- **Nginx**: /etc/nginx/sites-enabled/dreampick-tv.probooking.app (HTTPS via certbot)
- **Docker project name**: `dreampick` (use `-p dreampick` with docker compose)
- **Container registry**: ghcr.io/fix2015/dreampick-tv/frontend:latest

## CI/CD Pipeline

Push to `main` triggers:
1. **CI** (.github/workflows/ci.yml): Builds Docker image → pushes to GHCR
2. **Deploy** (.github/workflows/deploy.yml): SSHs into EC2, pulls image, restarts container, configures nginx on first deploy

GitHub Secrets required: `EC2_HOST`, `EC2_USER`, `EC2_SSH_PRIVATE_KEY` (base64-encoded ~/.ssh/service.pem)

## Static Assets

Images (418MB) and audio prompts are hosted on S3, NOT bundled in Docker:
- **S3 bucket**: gport (eu-central-1)
- **S3 prefix**: dreampick-tv/
- **URLs**: https://gport.s3.eu-central-1.amazonaws.com/dreampick-tv/images/... and .../audio/...
- **Upload command**: `aws --profile gport s3 sync public/images/ s3://gport/dreampick-tv/images/`

## Manual Deploy

```bash
ssh probooking
cd /opt/dreampick-tv
git fetch origin main && git reset --hard origin/main
docker build -f Dockerfile.prod -t ghcr.io/fix2015/dreampick-tv/frontend:latest .
cd infra && docker compose -f docker-compose.prod.yml -p dreampick up -d
```

## Health Check

```bash
ssh probooking "curl -sf http://127.0.0.1:3012/health"
curl -sf https://dreampick-tv.probooking.app/
```
