"use client";

import Chat from "../components/Chat";

export default function AIPage() {
  return (
    <main style={{maxWidth:800,margin:"24px auto",padding:20}}>
      <h1>Murillo AI — Chat</h1>
      <p style={{color:'#555'}}>Ask anything. Powered by OpenRouter (or OpenAI if configured).</p>
      <Chat />
    </main>
  );
}
