import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized Environment Variable Validation
 * Validates required secrets on server startup and fails fast if missing.
 */
export const validateEnv = () => {
  const required = ['SUPABASE_URL'];
  const missing = [];

  for (const key of required) {
    if (!process.env[key] || process.env[key].trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`[FATAL] Missing required production environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Security audit check: Ensure service role key or payment secret is NEVER exposed to frontend VITE_
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('VITE_') && (key.includes('SECRET') || key.includes('SERVICE_ROLE') || key.includes('PASSWORD'))) {
      console.error(`[SECURITY ERROR] Sensitive backend secret key "${key}" detected with public VITE_ prefix! Startup aborted.`);
      process.exit(1);
    }
  }
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'csc-center-super-secret-jwt-key-change-in-production-2026',
  RAZORPAY_KEY_ID: process.env.PAYMENT_PROVIDER_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.PAYMENT_PROVIDER_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
  WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret'
};
