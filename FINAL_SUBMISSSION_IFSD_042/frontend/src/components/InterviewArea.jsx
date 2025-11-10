import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

export default function InterviewArea({question}){
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const recogRef = useRef(null);

  useEffect(()=> {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (ev) => {
      let interim = '';
      let final = '';
      for (let i = ev.resultIndex; i < ev.results.length; ++i) {
        const r = ev.results[i];
        if (r.isFinal) final += r[0].transcript + ' ';
        else interim += r[0].transcript;
      }
      if(final) setTranscript(prev => prev + final);
    };
    recogRef.current = rec;
  },[]);

  function startRec(){
    if(!recogRef.current) return alert('SpeechRecognition not supported in this browser.');
    recogRef.current.start();
    setListening(true);
  }
  function stopRec(){
    if(!recogRef.current) return;
    recogRef.current.stop();
    setListening(false);
  }

  async function sendFeedback(){
    try{
      setFeedback({loading:true});
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      const res = await axios.post(`${base}/api/ai`, { question: question.text, transcript, time_allowed: 120 });
      setFeedback(res.data);
    }catch(err){
      console.error(err);
      setFeedback({error:'Unable to reach backend. Make sure backend is running.'});
    }
  }

  return (
    <div>
      <h2 style={{color:'#2563eb'}}>{question.title}</h2>
      <p>{question.text}</p>
      <div style={{display:'flex', gap:10, marginTop:10}}>
        <button onClick={startRec} style={{padding:'8px 12px', background:'#10b981', color:'#fff'}}>Start</button>
        <button onClick={stopRec} style={{padding:'8px 12px', background:'#ef4444', color:'#fff'}}>Stop</button>
        <button onClick={sendFeedback} style={{padding:'8px 12px', background:'#2563eb', color:'#fff'}}>Get AI Feedback</button>
      </div>

      <div style={{marginTop:12}}>
        <strong>Transcript</strong>
        <pre style={{whiteSpace:'pre-wrap', background:'#f3f4f6', padding:10, borderRadius:8}}>{transcript || '—'}</pre>
      </div>

      {feedback && (
        <div style={{marginTop:12, padding:12, border:'1px solid #eee', borderRadius:8}}>
          <div><strong>Score:</strong> {feedback.score ?? '—'}</div>
          <div style={{marginTop:8, whiteSpace:'pre-wrap'}}>{feedback.feedback ?? feedback.error}</div>
        </div>
      )}
    </div>
  );
}
