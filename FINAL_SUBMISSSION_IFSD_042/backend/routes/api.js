const express = require('express');
const router = express.Router();
const { callLLMForFeedback } = require('../utils/llmClient');

router.get('/test', (req,res) => {
  res.json({status:'ok', time: new Date().toISOString()});
});

router.post('/ai', async (req,res) => {
  try {
    const { question, transcript, time_allowed } = req.body;

    if (!question || !transcript) return res.status(400).json({error:'question and transcript required'});

    const ai = await callLLMForFeedback({question, transcript, time_allowed});
    res.json(ai);
  } catch(err) {
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

module.exports = router;