import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured || !supabase) {
      console.log('Supabase not configured, simulating success for:', email)
      return NextResponse.json({
        success: true,
        message: "🎉 Thanks for your interest! (Demo mode - Supabase not configured)"
      })
    }

    // Insert email into Supabase
    const { error } = await supabase
      .from('waitlist')
      .insert([{
        email: email,
        source: 'nextjs_landing_page',
        metadata: {
          referrer: request.headers.get('referer'),
          userAgent: request.headers.get('user-agent'),
          timestamp: new Date().toISOString()
        }
      }])
      .select()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({
          success: true,
          message: "You're already on the list! We'll notify you soon."
        })
      } else {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: "🎉 Welcome! You're on the list for early access."
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
