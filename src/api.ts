import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

let openaiClient: OpenAI | null = null;

// Simple cache for recent responses
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

if (OPENAI_API_KEY) {
    openaiClient = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
}

export async function callOpenAI(prompt: string): Promise<string> {
    // Check cache first
    const cached = responseCache.get(prompt.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.response;
    }
    if (!openaiClient) {
        console.warn('OpenAI API key not configured. Using fallback responses.');
        return getFallbackResponse(prompt);
    }

    try {
        const completion = await openaiClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant in a tooltip. Provide concise, clear answers. Keep responses brief but informative.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_completion_tokens: 150,
            temperature: 0.7
        });

        const response = completion.choices[0]?.message?.content || 'I couldn\'t generate a response. Please try again.';
        
        // Cache the response
        responseCache.set(prompt.toLowerCase(), { response, timestamp: Date.now() });
        
        // Clean old cache entries
        if (responseCache.size > 50) {
            const entries = Array.from(responseCache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            responseCache.delete(entries[0][0]);
        }
        
        return response;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('401')) {
                return 'API key authentication failed. Please check your OpenAI API key.';
            }
            if (error.message.includes('429')) {
                return 'Rate limit reached. Please try again in a moment.';
            }
            if (error.message.includes('model')) {
                return 'Model not available. Please check the model name.';
            }
        }
        
        return getFallbackResponse(prompt);
    }
}

function getFallbackResponse(prompt: string): string {
    const responses = [
        `I understand you asked about "${prompt}". Please configure an OpenAI API key for real responses.`,
        `Regarding "${prompt}" - Set up your API key in .env.local as VITE_OPENAI_API_KEY to enable AI responses.`,
        `You mentioned "${prompt}". This tooltip works best with an OpenAI API connection.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}