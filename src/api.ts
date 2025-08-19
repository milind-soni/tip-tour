// Demo API for the tooltip - in production, use a backend proxy to protect API keys

export async function callOpenAI(prompt: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return demo responses
    const responses = [
        `You asked about "${prompt}" - This is a demo response!`,
        `Interesting question: "${prompt}". In production, this would connect to a real AI API through a backend proxy.`,
        `Processing "${prompt}"... This demo shows how the tooltip handles user interactions.`,
        `Got it! You typed: "${prompt}". For real AI responses, implement a backend API endpoint.`,
        `Regarding "${prompt}" - This tooltip library supports AI integration via your own backend.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Example backend integration for production:
/*
export async function callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.message;
}
*/