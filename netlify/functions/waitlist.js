// netlify/functions/waitlist.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for server-side
);

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        email,
        source: 'landing_page',
        metadata: {
          referrer: event.headers.referer || '',
          timestamp: new Date().toISOString()
        }
      }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            success: true, 
            message: "You're already on the list!" 
          })
        };
      }
      throw error;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Successfully added to waitlist!' 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}