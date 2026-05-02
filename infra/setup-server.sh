#!/bin/bash
set -e

NGINX_SNIPPET="/opt/dreampick-tv/infra/nginx-snippet.conf"
SITES_AVAILABLE="/etc/nginx/sites-available/dreampick-tv.probooking.app"
SITES_ENABLED="/etc/nginx/sites-enabled/dreampick-tv.probooking.app"

echo "=== DreamPick TV Server Setup ==="

# Install nginx site config
if [ -f "$SITES_AVAILABLE" ]; then
    echo "Nginx config already exists. Updating..."
    cp "$SITES_AVAILABLE" "${SITES_AVAILABLE}.bak.$(date +%s)"
fi

cp "$NGINX_SNIPPET" "$SITES_AVAILABLE"

# Enable site
if [ ! -L "$SITES_ENABLED" ]; then
    ln -s "$SITES_AVAILABLE" "$SITES_ENABLED"
fi

# Test nginx config
echo "Testing nginx config..."
nginx -t

# Reload nginx
echo "Reloading nginx..."
systemctl reload nginx

echo ""
echo "=== Done! ==="
echo "Next steps:"
echo "  1. sudo certbot --nginx -d dreampick-tv.probooking.app"
echo "  2. cd /opt/dreampick-tv/infra"
echo "  3. docker compose -f docker-compose.prod.yml pull"
echo "  4. docker compose -f docker-compose.prod.yml up -d"
