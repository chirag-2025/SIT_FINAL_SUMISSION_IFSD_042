const axios = require('axios');

async function callLLMForFeedback({question, transcript, time_allowed}) {
  
 const words = transcript.trim().split(/\s+/).filter(Boolean).length;
  const fillerCount = (transcript.match(/\b(um|uh|like|you know)\b/gi) || []).length;
  const clarityPenalty = Math.min(20, fillerCount * 5);
  const lengthScore = Math.min(50, Math.round(Math.min(1, words / 100) * 50));
  const score = Math.max(0, 50 + lengthScore - clarityPenalty);

  const feedback = [
    `Length: approx ${words} words.`,
    `Filler words detected: ${fillerCount}. Try to reduce fillers for clarity.`,
    `Structure your answer: intro -> details -> result/impact.`
  ].join('\n');

  const followups = [
    'Can you explain tradeoffs in your approach?',
    'How would you scale this system for 1M users?'
  ];

  return { score, feedback, followups };
}

module.exports = { callLLMForFeedback };