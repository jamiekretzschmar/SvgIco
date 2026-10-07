import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Search Grounding API: Search web iconography standards, trends, brand guides & glyph design tips
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(200).json({
        summary: `Information for "${query}": Clean SVG icons should be built on an integer viewBox (e.g., 24x24), use 2px stroke width, strokeLinecap="round", strokeLinejoin="round", and ensure all path contours are closed for TTF conversion.`,
        sources: [
          { title: 'W3C SVG Specifications', uri: 'https://www.w3.org/TR/SVG2/' },
          { title: 'Lucide Icon Design Guidelines', uri: 'https://lucide.dev/guide/design/icon-design-guide' },
          { title: 'OpenType Font Specification', uri: 'https://learn.microsoft.com/en-us/typography/opentype/spec/' }
        ],
        queries: [query, `${query} icon svg specifications`],
        note: 'Set GEMINI_API_KEY for live real-time search grounding.'
      });
    }

    const prompt = `You are an expert web development iconography specialist.
Search Google for: "${query}".
Provide a concise, practical breakdown for web developers and icon designers including:
1. Standard icon metaphors, conventions, or official brand geometry.
2. Recommended SVG viewBox (usually 24x24), stroke width (usually 1.5-2px), and path structure.
3. Relevant Unicode private use area recommendations (e.g. E900-F8FF) or font glyph tips.
4. Key tags and categories for organizing this icon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = candidate?.groundingMetadata?.webSearchQueries || [];

    const sources = groundingChunks
      .filter((chunk: any) => chunk?.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return res.json({
      summary: response.text || 'No response generated.',
      sources,
      queries: webSearchQueries,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/search:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to perform search grounding',
    });
  }
});

// AI SVG Icon Generation & Optimization API with Search Grounding
app.post('/api/gemini/generate-svg', async (req: Request, res: Response) => {
  try {
    const { prompt, style = 'outline', category = 'General' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAIClient();
    if (!ai) {
      // Fallback clean template if no API key is present
      const fallbackName = prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'custom-icon';
      return res.json({
        name: fallbackName,
        category: category || 'Custom',
        tags: [fallbackName, 'custom', style],
        svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <circle cx="12" cy="12" r="9" />\n  <path d="m9 12 2 2 4-4" />\n</svg>`,
        explanation: 'Generated standard fallback icon. Connect GEMINI_API_KEY for dynamic AI generation.'
      });
    }

    const systemPrompt = `You are an expert SVG icon generator for web design icon sets.
The user wants an SVG icon for: "${prompt}".
Style preference: "${style}" (outline or filled).
Category: "${category}".

Use Google Search if needed to verify official logo shapes, standard web iconography conventions, or tech icons.

Return ONLY a JSON object (no markdown ticks or backticks) matching this exact format:
{
  "name": "icon-slug-name",
  "category": "Category Name",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "svgCode": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" width=\\"24\\" height=\\"24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\">...</svg>",
  "explanation": "Brief 1-sentence description of the geometry."
}

Rules:
1. ViewBox MUST BE "0 0 24 24".
2. Keep strokes clean, harmonious, pixel-grid aligned to 24x24.
3. For outline style, use fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round".
4. For filled style, use fill="currentColor" stroke="none".
5. Only valid SVG elements (<path>, <circle>, <rect>, <polyline>, <line>, <polygon>). Do not include <script> or external links.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk?.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    let jsonResult: any;
    try {
      jsonResult = JSON.parse(response.text || '{}');
    } catch {
      // Clean string if there are markdown wrappers
      const cleaned = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleaned);
    }

    return res.json({
      ...jsonResult,
      sources,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-svg:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate SVG icon',
    });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 GlyphForge server active on http://0.0.0.0:${port}`);
  });
}

setupServer();
