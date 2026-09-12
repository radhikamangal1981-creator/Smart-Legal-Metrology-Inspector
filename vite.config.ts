import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { analyzePackageWithGemini } from './src/server/geminiService.ts';
import { SAMPLE_PACKAGES } from './src/data/samplePackages.ts';
import { DEFAULT_MANDATORY_RULES } from './src/data/defaultRules.ts';

dotenv.config();

function legalMetrologyApiPlugin(): Plugin {
  return {
    name: 'legal-metrology-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              status: 'online',
              service: 'Smart Legal Metrology Inspector (SIH26034)',
              hasApiKey: !!process.env.GEMINI_API_KEY,
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        if (req.url === '/api/analyze' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const body = JSON.parse(bodyStr || '{}');
              const { imageBase64, mimeType, category = 'FOOD_BEVERAGE', activeRules = DEFAULT_MANDATORY_RULES, meta, sampleId } = body;

              if (sampleId) {
                const matchedSample = SAMPLE_PACKAGES.find((s) => s.id === sampleId);
                if (matchedSample) {
                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({
                      success: true,
                      source: 'BENCHMARK_PRESET',
                      result: matchedSample.precomputedResult,
                    })
                  );
                  return;
                }
              }

              if (!imageBase64) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'No image data provided.' }));
                return;
              }

              if (process.env.GEMINI_API_KEY) {
                try {
                  const result = await analyzePackageWithGemini(
                    imageBase64,
                    mimeType || 'image/jpeg',
                    category,
                    activeRules,
                    meta
                  );

                  res.statusCode = 200;
                  res.end(
                    JSON.stringify({
                      success: true,
                      source: 'GEMINI_3_8_FLASH_MULTIMODAL',
                      result,
                    })
                  );
                  return;
                } catch (geminiErr: any) {
                  console.error('Gemini API Error in dev middleware:', geminiErr);
                  res.statusCode = 500;
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: geminiErr?.message || 'Error occurred while calling Gemini model.',
                    })
                  );
                  return;
                }
              } else {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    success: false,
                    isApiKeyMissing: true,
                    error:
                      'GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in the Secrets panel, or explore the pre-loaded real-world sample packages.',
                  })
                );
                return;
              }
            } catch (err: any) {
              console.error('Error in /api/analyze middleware:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), legalMetrologyApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
