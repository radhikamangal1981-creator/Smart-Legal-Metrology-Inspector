import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { analyzePackageWithGemini } from './src/server/geminiService.ts';
import { SAMPLE_PACKAGES } from './src/data/samplePackages.ts';
import { DEFAULT_MANDATORY_RULES } from './src/data/defaultRules.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'Smart Legal Metrology Inspector (SIH26034)',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Primary multimodal inspection analysis endpoint
  app.post('/api/analyze', async (req, res) => {
    try {
      const { imageBase64, mimeType, category = 'FOOD_BEVERAGE', activeRules = DEFAULT_MANDATORY_RULES, meta, sampleId } = req.body;

      // If a sampleId is provided or the user selected one of the benchmark packages, check if we have precomputed gold-standard results
      if (sampleId) {
        const matchedSample = SAMPLE_PACKAGES.find((s) => s.id === sampleId);
        if (matchedSample) {
          return res.json({
            success: true,
            source: 'BENCHMARK_PRESET',
            result: matchedSample.precomputedResult,
          });
        }
      }

      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          error: 'No image data provided for analysis.',
        });
      }

      // If Gemini API Key is configured, run multimodal analysis
      if (process.env.GEMINI_API_KEY) {
        try {
          const result = await analyzePackageWithGemini(
            imageBase64,
            mimeType || 'image/jpeg',
            category,
            activeRules,
            meta
          );

          return res.json({
            success: true,
            source: 'GEMINI_3_8_FLASH_MULTIMODAL',
            result,
          });
        } catch (geminiError: any) {
          console.error('Gemini multimodal analysis error:', geminiError);
          // If Gemini API call fails (e.g. invalid key, quota, or network), provide detailed error or fallback
          return res.status(500).json({
            success: false,
            error: geminiError?.message || 'Failed to process image with Gemini AI model.',
          });
        }
      } else {
        // If API key is not configured, inform the client or provide benchmark fallback
        return res.status(400).json({
          success: false,
          error: 'GEMINI_API_KEY is not configured in server environment. Please set GEMINI_API_KEY in the Secrets panel, or explore the pre-loaded real-world sample packages.',
          isApiKeyMissing: true,
        });
      }
    } catch (error: any) {
      console.error('Server error in /api/analyze:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Internal server error during inspection.',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Legal Metrology Inspector server running on http://localhost:${PORT}`);
  });
}

startServer();

