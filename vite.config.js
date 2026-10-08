import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apiMiddleware = () => {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/')) {
          try {
            const routeName = req.url.split('?')[0].replace('/api/', '');
            
            // Allow bypassing API middleware for static assets that might be in /api/
            if (routeName === 'jobsData.js' || routeName === 'jobs.js') {
              return next();
            }

            const modulePath = path.resolve(__dirname, `./api/${routeName}.js`);
            if (!fs.existsSync(modulePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: `Route ${routeName} not found` }));
              return;
            }

            const module = await server.ssrLoadModule(modulePath);
            
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', async () => {
              if (body) {
                try {
                  req.body = JSON.parse(body);
                } catch(e) {
                  req.body = body;
                }
              }
              
              res.status = (code) => { res.statusCode = code; return res; };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              
              await module.default(req, res);
            });
            return;
          } catch (e) {
            console.error('API Error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
            return;
          }
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), apiMiddleware()],
})
