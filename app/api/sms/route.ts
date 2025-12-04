import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    let body: any;

    // Parse based on content type
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = {};
      for (const [k, v] of params) body[k] = v;
    } else {
      // Fallback: try JSON, otherwise treat as text
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = { raw: text };
      }
    }

    console.log('Received SMS data:', body);

    // If it's a webhook from Diafaan (has 'from' field), just log and return OK
    if (body.from || body.body || body.message_id) {
      console.log('Incoming SMS webhook:', body);
      return NextResponse.json({ status: 'ok' });
    }

    // Otherwise, it's a send request from your frontend
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing to or message' }, { status: 400 });
    }

    const baseUrl = 'http://192.168.0.108:9711/http/send-message';
    const params = {
      username: 'admin',
      password: 'admin',
      to: String(to),
      message: String(message),
    };

    const qs = new URLSearchParams(params).toString();
    const fullUrl = `${baseUrl}?${qs}`;

    const response = await axios.get(fullUrl, { timeout: 10000 });

    return NextResponse.json({ success: true, data: response.data });
  } catch (err: any) {
    console.error('SMS send error:', err);
    return NextResponse.json(
      { error: err?.response?.data ?? err?.message ?? 'Failed to send SMS' },
      { status: 500 }
    );
  }
}