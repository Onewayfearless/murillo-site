"use client";

import { useState } from "react";

type Message = { id: number; from: "user" | "ai"; text: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      const aiText = (data?.reply) ? String(data.reply) : "(no reply)";
      const aiMsg: Message = { id: Date.now() + 1, from: "ai", text: aiText };
      setMessages((m) => [...m, aiMsg]);

    } catch (err) {
      const errMsg: Message = { id: Date.now() + 2, from: "ai", text: "Error contacting AI." };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{border:'1px solid #eee',borderRadius:8,padding:12,minHeight:200,marginBottom:12}}>
        {messages.length === 0 && <div style={{color:'#888'}}>No messages yet — ask anything.</div>}
        {messages.map((m) => (
          <div key={m.id} style={{marginBottom:10}}>
            <div style={{fontSize:12,color:'#666'}}>{m.from === 'user' ? 'You' : 'Murillo AI'}</div>
            <div style={{background: m.from==='user'? '#e6f7ff':'#f7f7f7',padding:8,borderRadius:6,whiteSpace:'pre-wrap'}}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:8}}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Type a question..."
          style={{flex:1,padding:10,borderRadius:6,border:'1px solid #ddd'}}
        />
        <button onClick={send} disabled={loading} style={{padding:'10px 14px',borderRadius:6}}>
          {loading ? 'Thinking…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
