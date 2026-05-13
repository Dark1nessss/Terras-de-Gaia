/**
 * Authentication & Authorization Utilities
 * Ensures only the Next.js server can query the WordPress API
 */

import { NextRequest } from 'next/server';

/**
 * Verify request comes from internal Next.js server
 * Not from external browsers or API calls
 */
export function isInternalRequest(request: NextRequest): boolean {
  const internalToken = request.headers.get('x-internal-token');
  const expectedToken = process.env.INTERNAL_API_TOKEN;

  // No token configured = no authentication required (development mode)
  if (!expectedToken) {
    console.warn(
      '[SECURITY] No INTERNAL_API_TOKEN set. API routes are unprotected. Set this in production!'
    );
    return true;
  }

  return internalToken === expectedToken;
}

/**
 * Get WordPress API authentication headers
 * Uses Basic Auth with WP application password
 */
export function getWordPressAuthHeaders(): Record<string, string> {
  const wpUser = process.env.WP_USER;
  const wpPassword = process.env.WP_APP_PASSWORD;

  if (!wpUser || !wpPassword) {
    console.error('[AUTH] Missing WP_USER or WP_APP_PASSWORD environment variables');
    return {};
  }

  const credentials = `${wpUser}:${wpPassword}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  return {
    'Authorization': `Basic ${base64Credentials}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Get all required headers for API requests
 * Includes WordPress auth + custom headers
 */
export function getSecureHeaders(): Record<string, string> {
  return {
    ...getWordPressAuthHeaders(),
    'User-Agent': 'Terras-de-Gaia-Server/1.0',
  };
}

/**
 * Check if WordPress API is properly protected
 * Logs security warnings
 */
export function validateSecuritySetup(): void {
  const warnings: string[] = [];

  // Check WordPress credentials
  if (!process.env.WP_USER || !process.env.WP_APP_PASSWORD) {
    warnings.push('Missing WordPress authentication. Set WP_USER and WP_APP_PASSWORD.');
  }

  // Check internal token
  if (!process.env.INTERNAL_API_TOKEN) {
    warnings.push(
      'No INTERNAL_API_TOKEN set. API routes are unprotected. ' +
      'Set INTERNAL_API_TOKEN in production to 32+ character random string.'
    );
  }

  // Check API URL
  if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL && !process.env.WORDPRESS_API_URL) {
    warnings.push('Missing WORDPRESS_API_URL environment variable.');
  }

  if (warnings.length > 0) {
    console.warn('[SECURITY WARNINGS]');
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }
}

/**
 * Generate secure random token for INTERNAL_API_TOKEN
 * Run once and add to .env.local
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
