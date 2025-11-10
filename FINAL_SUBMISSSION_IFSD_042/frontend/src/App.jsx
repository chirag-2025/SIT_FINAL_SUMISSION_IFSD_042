import React, {useEffect, useState} from 'react';
import InterviewArea from './components/InterviewArea';
import axios from 'axios';

export default function App(){
  const [questions, setQuestions] = useState([
    {id:1, title:'Tell me about yourself', text:'Give a 60-90s intro.'},
    {id:2, title:'Explain a project you built', text:'Describe problem, approach, tradeoffs.'}
  ]);
  const [active, setActive] = useState(questions[0]);

  useEffect(()=> {
    axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/test`)
      .then(()=> console.log('Backend reachable'))
      .catch(()=> console.log('Backend not reachable'));
  },[]);

  return (
    <div style={{display:'flex',gap:20, padding:20, fontFamily:'Arial, sans-serif'}}>
      <aside style={{width:280, background:'#fff', padding:16, borderRadius:10}}>
        <h3 style={{color:'#2563eb'}}>Question Bank</h3>
        {questions.map(q=>(
          <div key={q.id} onClick={()=>setActive(q)} style={{padding:10, borderRadius:8, cursor:'pointer', marginBottom:8, border: active===q ? '2px solid #2563eb':'1px solid #eee'}}>
            <strong>{q.title}</strong>
            <p style={{fontSize:13, color:'#666'}}>{q.text}</p>
          </div>
        ))}
      </aside>

      <main style={{flex:1, background:'#fff', padding:16, borderRadius:10}}>
        <InterviewArea question={active} />
      </main>
    </div>
  );
}