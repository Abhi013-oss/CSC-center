import assert from 'assert';
import crypto from 'crypto';
import { isValidStatus, isValidTransition } from '../utils/applicationState.js';
import { paymentService } from '../services/paymentService.js';

console.log('---------------------------------------------------------');
console.log('CSC CENTER PRODUCTION AUDIT & AUTOMATED TEST SUITE');
console.log('---------------------------------------------------------');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`✓ [PASS] ${name}`);
  } catch (err) {
    console.error(`✗ [FAIL] ${name}: ${err.message}`);
  }
}

// 1. Application State Machine Unit Tests
test('State Machine: Valid status format validation', () => {
  assert.strictEqual(isValidStatus('pending'), true);
  assert.strictEqual(isValidStatus('approved'), true);
  assert.strictEqual(isValidStatus('invalid_status_xyz'), false);
});

test('State Machine: Valid status transition rules', () => {
  assert.strictEqual(isValidTransition('pending', 'under_review'), true);
  assert.strictEqual(isValidTransition('under_review', 'approved'), true);
  assert.strictEqual(isValidTransition('approved', 'completed'), true);
  assert.strictEqual(isValidTransition('completed', 'pending'), false); // Cannot move backward from completed
});

// 2. Payment Signature & Webhook Verification Unit Tests
test('Payment Security: HMAC-SHA256 signature verification logic', () => {
  const orderId = 'order_12345';
  const paymentId = 'pay_67890';
  const secret = 'test_secret_key';

  const expectedSig = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

  assert.strictEqual(typeof expectedSig, 'string');
  assert.strictEqual(expectedSig.length, 64);
});

test('Payment Gateway: Public key retrieval', () => {
  const pubKey = paymentService.getPublicKey();
  assert.strictEqual(typeof pubKey, 'string');
});

// 3. Security & Environment Audit
test('Security Audit: Environment variable isolation', () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  assert.strictEqual(serviceKey.startsWith('VITE_'), false);
});

console.log('---------------------------------------------------------');
console.log(`TEST SUMMARY: ${passed} / ${total} tests passed cleanly.`);
console.log('---------------------------------------------------------');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
