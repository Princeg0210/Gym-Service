import http from 'http';
import { createClient } from '@supabase/supabase-js';

const PORT = process.env.PORT || 5000;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pkyxubkcxoewyojyulwr.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YfMeXW_FBpjfx7Vg61_MWQ_g7WbZR7P';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // Health check
    if (pathname === '/health' && req.method === 'GET') {
      sendJson(res, 200, { status: 'healthy', timestamp: new Date().toISOString() });
      return;
    }

    // Members
    if (pathname === '/api/members') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, { success: true, data });
        return;
      }
      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { data, error } = await supabase.from('members').insert([body]).select().single();
        if (error) throw error;
        sendJson(res, 201, { success: true, data });
        return;
      }
    }

    // Attendance
    if (pathname === '/api/attendance') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('attendance').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, { success: true, data });
        return;
      }
      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { data, error } = await supabase.from('attendance').insert([body]).select().single();
        if (error) throw error;
        sendJson(res, 201, { success: true, data });
        return;
      }
    }

    // Payments
    if (pathname === '/api/payments') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, { success: true, data });
        return;
      }
      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { data, error } = await supabase.from('payments').insert([body]).select().single();
        if (error) throw error;
        sendJson(res, 201, { success: true, data });
        return;
      }
    }

    // Equipment
    if (pathname === '/api/equipment') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('equipment').select('*').order('name', { ascending: true });
        if (error) throw error;
        sendJson(res, 200, { success: true, data });
        return;
      }
    }

    // Leads
    if (pathname === '/api/leads') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        sendJson(res, 200, { success: true, data });
        return;
      }
      if (req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { data, error } = await supabase.from('leads').insert([body]).select().single();
        if (error) throw error;
        sendJson(res, 201, { success: true, data });
        return;
      }
    }

    // Fallback 404
    sendJson(res, 404, { success: false, error: 'Route not found' });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { success: false, error: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`[GymPRO Backend API] listening at http://localhost:${PORT}`);
  console.log(`[Database Connected] -> ${SUPABASE_URL}`);
});
