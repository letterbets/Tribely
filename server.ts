import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Fallback intelligent coaching responses for zero-downtime experience
const FALLBACK_MENTOR_RESPONSES: Record<string, string[]> = {
  bouldering: [
    "Great focus! For today's 15 minutes, focus entirely on 'silent feet'. Place your toe quietly on each foothold without readjusting or tapping twice. This builds hip precision faster than pull-ups!",
    "Bouldering plateaus are usually about hip positioning, not arm strength. Try keeping your hips glued close to the wall like a pane of glass on your next warm-up slab.",
    "If your forearm pump is kicking in early, check your grip: are you overgripping jug holds? Try relaxing your grip by 20% and letting your skeleton hang straight.",
  ],
  watercolor: [
    "A 15-minute warm-up win: Paint 3 small gradient swatches transitioning from saturated ultramarine to clear water. Don't worry about painting a scene yet—feel how pigment flows!",
    "Remember: with watercolor, the paper is your light source. Avoid touching the pure white highlights and let the damp paper do the blending work for you.",
    "Quick tip on brushes: A single size 8 round synthetic brush is all you need for 90% of paintings. You don't need expensive sable hair to start making beautiful strokes.",
  ],
  guitar: [
    "Today's 15-min drill: The 'Air Changes' exercise for C to Am. Don't strum with your right hand yet; just lift all left fingers 2mm off the frets and land them simultaneously 20 times.",
    "Finger soreness is completely normal in your first 2 weeks. 15 minutes daily is actually much better than a single 2-hour marathon because it lets calluses form naturally.",
    "Try humming the melody before plucking the notes. Connecting your vocal pitch to fretboard position accelerates ear training tenfold.",
  ],
  photography: [
    "Today's 15-min challenge: Frame 5 photos inside your room without changing your physical spot—only change your shooting height (floor level, eye level, bird's eye overhead).",
    "Great photography isn't about expensive lenses; it's about noticing where the light falls. Look for window light hitting an ordinary mug or chair shadow.",
    "Try shooting in monochrome for 3 days. Removing color forces you to see tonal contrast, texture, and leading lines.",
  ],
  gardening: [
    "Today's 15-min check: Use the 'finger knuckle' moisture test. Stick your index finger 1 inch into the soil. If it's cool and damp, don't water today! Overwatering kills more beginner plants than underwatering.",
    "Rotate your indoor pots 90 degrees clockwise every few days so your foliage grows balanced instead of leaning towards the window.",
    "Save clean kitchen scraps (coffee grounds, crushed eggshells) to start a mini compost jar—your plants will love the gentle mineral boost.",
  ],
};

function getSmartFallbackResponse(hobby: string, userMessage: string): string {
  const normalizedHobby = (hobby || 'general').toLowerCase();
  const matchedKey = Object.keys(FALLBACK_MENTOR_RESPONSES).find((k) =>
    normalizedHobby.includes(k)
  );

  const tips = matchedKey
    ? FALLBACK_MENTOR_RESPONSES[matchedKey]
    : [
        "15 minutes of intentional daily practice beats 3 hours of unfocused weekend cramming. What's one tiny micro-step you can practice right now?",
        "Don't worry about perfection early on. Focus on rhythm and showing up. You're already further ahead than when you were just watching videos!",
      ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return `${randomTip}\n\nWhat specific detail would you like to explore next?`;
}

// 1. API: AI Hobby Mentor Chat
app.post('/api/mentor', async (req, res) => {
  try {
    const { message, hobby, level = 'Beginner', streakDays = 5 } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      const fallback = getSmartFallbackResponse(hobby, message);
      return res.json({ reply: fallback });
    }

    const systemInstruction = `You are Tribely's warm, organic, and ultra-approachable hobby mentor.
The user is learning "${hobby || 'a creative hobby'}" at a ${level} level (Current streak: ${streakDays} days).
Guidelines:
- Keep responses concise, conversational, and direct (2-4 short paragraphs maximum).
- Emphasize small, 15-minute micro-steps to prevent overwhelm.
- Encourage low-cost starter gear and sustainable habits.
- End with one encouraging question or a tiny actionable drill the user can do right away.
- Avoid robotic corporate AI jargon, avoid markdown header spam or nested lists. Keep it warm and human.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || getSmartFallbackResponse(hobby, message);
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error calling Gemini mentor:', error);
    const fallback = getSmartFallbackResponse(req.body.hobby, req.body.message);
    return res.json({ reply: fallback });
  }
});

// 2. API: Convert Social Media Bookmark / Reel / Video into Actionable 15-Min Chapter
app.post('/api/digest-bookmark', async (req, res) => {
  try {
    const { url, notes, hobby } = req.body;

    if (!notes && !url) {
      return res.status(400).json({ error: 'URL or notes are required' });
    }

    if (!ai) {
      // Smart structured fallback
      return res.json({
        chapter: {
          title: `15-Min Practice: ${notes ? notes.slice(0, 35) : 'Technique Breakdown'}`,
          objective: 'Turn passive social watching into active muscle memory.',
          actionableSteps: [
            'Spend 3 mins setting up minimal gear with no distractions.',
            'Drill the core movement/technique highlighted in the video 10 times slowly.',
            'Take a quick photo or note of your result to track progression.',
          ],
          takeaway: 'Focus on clean mechanics before speed or complexity.',
          budgetTip: 'Use whatever tools you have on hand before buying specialized gear.',
        },
      });
    }

    const prompt = `A user saved this social media post / bookmark for their hobby "${hobby || 'General Craft'}":
Post / Link: ${url || 'Social Video'}
User notes / title: ${notes || 'Inspiring technique'}

Analyze this and return a clean JSON object summarizing it into a 15-minute actionable practice chapter.
Structure JSON:
{
  "title": "Short catchy title (under 6 words)",
  "objective": "One clear sentence on what skill this unlocks",
  "actionableSteps": ["Step 1 (3 min)", "Step 2 (8 min core drill)", "Step 3 (4 min review/clean)"],
  "takeaway": "Key insight from the creator/video",
  "budgetTip": "Frugal/low-cost way to practice without expensive purchases"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ chapter: parsed });
  } catch (error) {
    console.error('Error digesting bookmark:', error);
    return res.json({
      chapter: {
        title: 'Actionable 15-Minute Drill',
        objective: 'Practice the core fundamentals demonstrated in your saved bookmark.',
        actionableSteps: [
          'Prepare your workspace in 2 minutes.',
          'Execute 10 slow, deliberate repetitions of the core action.',
          'Review where you felt tension or hesitation.',
        ],
        takeaway: 'Consistent micro-reps produce better retention than watching hours of tutorials.',
        budgetTip: 'Start with household basics or borrow gear before buying new.',
      },
    });
  }
});

// Dev / Prod mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tribely server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
