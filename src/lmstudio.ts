// Direct connection to LM Studio (CORS enabled)
const LM_STUDIO_ENDPOINT = 'http://localhost:1234/v1/chat/completions';
const MODEL_ID = 'gemma-3-270m-it-mlx';

export async function callLMStudio(prompt: string): Promise<string> {
    // Ensure prompt is not empty
    if (!prompt || prompt.trim() === '') {
        return 'Please enter a question.';
    }
    
    const requestBody = {
        model: MODEL_ID,
        messages: [
            {
                role: "system",
                content: "You are a helpful AI assistant in a tooltip. Provide concise, clear answers. Keep responses brief but informative."
            },
            {
                role: "user", 
                content: prompt.trim()
            }
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: false
    };
    
    console.log('Sending request to LM Studio:', JSON.stringify(requestBody, null, 2));
    
    try {
        const response = await fetch(LM_STUDIO_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LM Studio error response:', errorText);
            throw new Error(`LM Studio error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('LM Studio response:', data);
        
        // Extract the assistant's response
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return data.choices[0].message.content || 'No response generated.';
        }
        
        return 'No response generated.';
        
    } catch (error) {
        console.error('LM Studio API Error:', error);
        
        if (error instanceof Error) {
            if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                return 'Cannot connect to LM Studio. Please ensure the server is running on port 1234 and CORS is enabled.';
            }
            return `Error: ${error.message}`;
        }
        
        return 'An unexpected error occurred. Check the console for details.';
    }
}

export async function checkLMStudioConnection(): Promise<boolean> {
    try {
        const response = await fetch('http://localhost:1234/v1/models');
        return response.ok;
    } catch {
        return false;
    }
}