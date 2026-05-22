/**
 * JanMitra AI - Enterprise Grievance Governance System
 * Core Logic & Structural Payload Verification Script
 */

const { getSLADays, calculateEstimatedResolution } = require('./utils/slaCalculator');
const { calculatePriority } = require('./utils/priorityScorer');
const { classifyLocally } = require('./services/fallback.service');

// Color helpers for terminal output
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [${green('PASS')}] ${message}`);
    testsPassed++;
  } else {
    console.log(`  [${red('FAIL')}] ${message}`);
    testsFailed++;
  }
}

console.log(`\n=============================================================`);
console.log(cyan(`[JanMitra AI Core Verification] Starting Tests...`));
console.log(`=============================================================\n`);

// -------------------------------------------------------------
// 1. SLA CALCULATOR TESTS
// -------------------------------------------------------------
console.log(cyan(`[Test 1] SLA Calculator Utility`));
try {
  assert(getSLADays('electricity') === 2, 'Electricity SLA should be 2 days');
  assert(getSLADays('water') === 2, 'Water SLA should be 2 days');
  assert(getSLADays('sanitation') === 4, 'Sanitation SLA should be 4 days');
  assert(getSLADays('road') === 10, 'Road SLA should be 10 days');
  assert(getSLADays('other') === 7, 'Other SLA should be 7 days');
  assert(getSLADays('random-junk') === 7, 'Undefined category SLA should default to 7 days');

  const now = new Date();
  const resolutionDate = calculateEstimatedResolution('electricity', now);
  const diffTime = Math.abs(resolutionDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  assert(diffDays === 2, 'Estimated resolution date should be exactly 2 days in the future');
} catch (e) {
  console.error(red('SLA Calculator test failed with error: '), e.message);
  testsFailed++;
}

// -------------------------------------------------------------
// 2. PRIORITY SCORER TESTS
// -------------------------------------------------------------
console.log(`\n` + cyan(`[Test 2] Priority Scorer Utility`));
try {
  // Low urgency + Neutral sentiment + standard category
  const res1 = calculatePriority({ urgency: 'low', sentiment: 'neutral', category: 'education' });
  assert(res1.score === 35, `Low/Neutral/Education score should be 35 (actual: ${res1.score})`);
  assert(res1.requiresEscalation === false, 'Score of 35 should NOT trigger escalation');

  // Critical urgency + Negative sentiment + High-impact category (Water)
  const res2 = calculatePriority({ urgency: 'critical', sentiment: 'negative', category: 'water' });
  assert(res2.score === 100, `Critical/Negative/Water score should be capped at 100 (actual: ${res2.score})`);
  assert(res2.requiresEscalation === true, 'Score of 100 MUST trigger escalation');

  // High urgency + Negative sentiment + sanitation
  const res3 = calculatePriority({ urgency: 'high', sentiment: 'negative', category: 'sanitation' });
  assert(res3.score === 80, `High/Negative/Sanitation score should be 80 (actual: ${res3.score})`);
  assert(res3.requiresEscalation === true, 'Score of 80 MUST trigger escalation');
} catch (e) {
  console.error(red('Priority Scorer test failed with error: '), e.message);
  testsFailed++;
}

// -------------------------------------------------------------
// 3. FALLBACK CLASSIFICATION & STRUCTURE VERIFICATION
// -------------------------------------------------------------
console.log(`\n` + cyan(`[Test 3] Local Keyword Routing & Strict JSON Format Validation`));
try {
  const mockComplaints = [
    {
      title: 'Water pipe leak near Sector 5',
      desc: 'There is a severe leakage in the main drinking water pipeline. Water has been flooding the street since yesterday morning. It is causing extreme water wastage and dirty water is logging in front of houses.',
      expectedCategory: 'water',
      expectedDept: 'Jal Nigam',
      expectedUrgency: 'High'
    },
    {
      title: 'High voltage spark from transformer danger',
      desc: 'The electricity transformer in our locality is sparking heavily. Loose wire hanging down is extremely dangerous and can cause fatal electric shocks. Immediate emergency action required!',
      expectedCategory: 'electricity',
      expectedDept: 'Vidyut Vibhag',
      expectedUrgency: 'Critical'
    },
    {
      title: 'School fees hike and missing teachers',
      desc: 'Government secondary school teachers are not taking classes and the management has arbitrarily increased the extracurricular fees without authority. Students are suffering.',
      expectedCategory: 'education',
      expectedDept: 'Shiksha Vibhag',
      expectedUrgency: 'Low'
    }
  ];

  const strictKeys = [
    'category', 'department', 'urgency', 'urgency_reason', 'sentiment',
    'summary_en', 'summary_hi', 'citizen_update_en', 'citizen_update_hi',
    'sms_hi', 'ticket_sla_days', 'ai_confidence_score', 'priority_score',
    'estimated_resolution', 'requires_escalation', 'department_note', 'tags'
  ];

  for (let i = 0; i < mockComplaints.length; i++) {
    const mock = mockComplaints[i];
    console.log(yellow(`  Subtest 3.${i + 1}: ${mock.title}`));

    const result = classifyLocally(mock.title, mock.desc);

    // Verify exact routing
    assert(result.category === mock.expectedCategory, `Should classify category as "${mock.expectedCategory}" (got: "${result.category}")`);
    assert(result.department === mock.expectedDept, `Should route to "${mock.expectedDept}" (got: "${result.department}")`);
    assert(result.urgency === mock.expectedUrgency, `Should detect urgency as "${mock.expectedUrgency}" (got: "${result.urgency}")`);

    // Verify strict structural compliance
    let structuresMatch = true;
    for (const key of strictKeys) {
      if (!(key in result)) {
        structuresMatch = false;
        console.log(`    [${red('ERROR')}] Missing required key: "${key}"`);
      }
    }
    assert(structuresMatch, 'Result payload contains ALL keys required by the STRICT JSON CONTRACT');
    
    // Verify types of keys
    assert(typeof result.category === 'string', 'category must be string');
    assert(typeof result.department === 'string', 'department must be string');
    assert(typeof result.urgency === 'string', 'urgency must be string');
    assert(typeof result.urgency_reason === 'string', 'urgency_reason must be string');
    assert(typeof result.sentiment === 'string', 'sentiment must be string');
    assert(typeof result.summary_en === 'string', 'summary_en must be string');
    assert(typeof result.summary_hi === 'string', 'summary_hi must be string');
    assert(typeof result.citizen_update_en === 'string', 'citizen_update_en must be string');
    assert(typeof result.citizen_update_hi === 'string', 'citizen_update_hi must be string');
    assert(typeof result.sms_hi === 'string', 'sms_hi must be string');
    assert(typeof result.ticket_sla_days === 'number', 'ticket_sla_days must be number');
    assert(typeof result.ai_confidence_score === 'number', 'ai_confidence_score must be number');
    assert(typeof result.priority_score === 'number', 'priority_score must be number');
    assert(typeof result.estimated_resolution === 'string', 'estimated_resolution must be an ISO date string');
    assert(typeof result.requires_escalation === 'boolean', 'requires_escalation must be boolean');
    assert(typeof result.department_note === 'string', 'department_note must be string');
    assert(Array.isArray(result.tags), 'tags must be an array');
  }
} catch (e) {
  console.error(red('Grievance Classification test failed with error: '), e.message);
  testsFailed++;
}

// -------------------------------------------------------------
// VERDICT
// -------------------------------------------------------------
console.log(`\n=============================================================`);
console.log(cyan(`[JanMitra AI Core Verification] Completed!`));
console.log(`  Total Passed Assertions: ${green(testsPassed)}`);
console.log(`  Total Failed Assertions: ${testsFailed > 0 ? red(testsFailed) : green(testsFailed)}`);
console.log(`=============================================================\n`);

if (testsFailed > 0) {
  console.log(red('Verdict: Verification failed. Please resolve the bugs shown above.'));
  process.exit(1);
} else {
  console.log(green('Verdict: ALL SYSTEM LOGIC AND PAYLOAD STRUCTURE CONTRACTS ARE 100% CORRECT AND COMPLIANT!'));
  process.exit(0);
}
