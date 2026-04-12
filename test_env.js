import 'dotenv/config';
const url = process.env.SUPABASE_URL;
console.log('SUPABASE_URL:', JSON.stringify(url));
console.log('Length:', url ? url.length : 0);
console.log('PORT:', JSON.stringify(process.env.PORT));
console.log('ANON_KEY Present:', !!process.env.SUPABASE_ANON_KEY);
