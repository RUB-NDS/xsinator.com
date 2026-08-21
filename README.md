# XSinator.com
XS-Leak Browser Test Suite 

[Xsinator.com](https://xsinator.com/) is an XS-Leak browser test suite that was created for the paper  XSinator.com: From a Formal Model to the Automatic Evaluation of Cross-Site Leaks in Web Browsers. 

### Setup

1. Clone the repository
2. Configure domains in `src/config.js`:
   ```javascript
   const MAIN_DOMAIN = 'xsinator.com'
   const CROSSORIGIN_DOMAIN = 'crossorigin.xsinator.xyz'
   const WS_DOMAIN = 'ws.xsinator.com'
   ```
3. Build javascript: `npm install && npm run build`
4. Copy `.env.example` to `.env` and update domains
5. Create the shared docker network: `docker network create net-xsinator`
6. `docker-compose up -d`

### Deployment with Traefik

The application is designed to run behind a Traefik reverse proxy:

- Requires an external `net-xsinator` network, shared with Traefik
- Traefik has to provide the `web` (80) and `websecure` (443) entrypoints,
  a `redirect-to-https@docker` middleware and a `cloudflare` certresolver
- SSL/TLS is handled by Traefik, nginx only listens on port 80
- Three domains required: main, cross-origin, and websocket

DNS records needed:
- `MAIN_DOMAIN` -> server IP
- `CROSSORIGIN_DOMAIN` -> server IP  
- `WS_DOMAIN` -> server IP

### Layout

- `/app/index.html` - test runner (landing page)
- `/app/results.html` - browser comparison table
- `/app/testcases` - php testcases 
- `/src` - javascript src
- `/ws` - go websocket server
- `/nginx` - webserver config 
