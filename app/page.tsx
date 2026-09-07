'use client';

import { FormEvent, useMemo, useState } from "react";

type Product = { title: string; price: string; rating: string; sales: string; url: string; image?: string; summary: string };
type Script = { hook: string; scenes: { time: string; visual: string; voice: string }[]; cta: string; caption: string; hashtags: string[] };

type Screen = "home" | "product" | "style" | "generate" | "result" | "videos";

const styles = [
  ["🔥", "Viral", "Curiosidade + surpresa"],
  ["👩", "UGC", "Recomendação natural"],
  ["💰", "Oferta", "Preço + benefício"],
  ["😱", "Problema → solução", "Dor + transformação"],
  ["⭐", "Review", "Confiança + prova"],
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState("Viral");
  const [duration, setDuration] = useState(30);
  const [product, setProduct] = useState<Product | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };

  async function analyzeProduct(event?: FormEvent) {
    event?.preventDefault();
    if (!url.trim()) return showMessage("Cole o link do produto primeiro.");
    setLoading(true);
    setScreen("product");
    try {
      const response = await fetch("/api/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível analisar o link.");
      setProduct(data.product);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao analisar produto.");
      setScreen("home");
    } finally { setLoading(false); }
  }

  async function createScript() {
    if (!product) return;
    setScreen("generate");
    setProgress(10);
    setLoading(true);
    try {
      const timer = window.setInterval(() => setProgress((p) => Math.min(p + 12, 82)), 350);
      const response = await fetch("/api/create-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, style, duration }),
      });
      window.clearInterval(timer);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível criar o roteiro.");
      setProgress(100);
      setScript(data.script);
      window.setTimeout(() => setScreen("result"), 500);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Erro ao criar roteiro.");
      setScreen("style");
    } finally { setLoading(false); }
  }

  const title = useMemo(() => {
    if (screen === "product") return "Produto encontrado";
    if (screen === "style") return "Estratégia do vídeo";
    if (screen === "generate") return "Criando seu vídeo";
    if (screen === "result") return "Seu criativo";
    if (screen === "videos") return "Meus vídeos";
    return "Shopee Video AI";
  }, [screen]);

  return (
    <main className="app-shell">
      <header className="topbar"><div className="brand">SHOPEE <span>VIDEO AI</span></div><div className="avatar">L</div></header>
      {message && <div className="toast">{message}</div>}
      <div className="container">
        {screen === "home" && <>
          <section className="hero"><p className="muted">Seu estúdio de afiliados</p><h1>Transforme produtos em vídeos que vendem.</h1><p className="muted">Cole um link e deixe a IA cuidar do roteiro, gancho e CTA.</p></section>
          <section className="card section"><form onSubmit={analyzeProduct} className="grid">
            <label className="label">LINK DO PRODUTO</label>
            <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Cole aqui o link da Shopee..." inputMode="url" />
            <button className="primary" disabled={loading}>{loading ? "Analisando..." : "🚀 Criar novo vídeo"}</button>
          </form></section>
          <section className="grid grid-2 section"><div className="card"><strong>127</strong><div className="muted">Vídeos criados</div></div><div className="card"><strong>43</strong><div className="muted">Produtos</div></div></section>
          <section className="card section"><strong>⚡ Modo automático</strong><p className="muted">A IA escolhe o melhor ângulo, duração e CTA para você.</p><button className="secondary" onClick={() => setUrl("https://shopee.com.br/produto-demo")}>Testar com produto demo</button></section>
        </>}

        {screen === "product" && <>
          <button className="secondary" onClick={() => setScreen("home")}>← Voltar</button>
          <h2>{title}</h2>
          {loading ? <div className="card"><div className="progress"><div style={{width:"55%"}} /></div><div className="steps"><div className="step done"><span className="step-dot">✓</span>Recebendo o link</div><div className="step"><span className="step-dot">2</span>Encontrando informações</div><div className="step"><span className="step-dot">3</span>Preparando estratégia</div></div></div> : product && <div className="grid">
            <div className="card"><div className="product-head"><div className="product-image">🛍️</div><div><strong>{product.title}</strong><p className="muted">{product.summary}</p></div></div><div className="chips"><span className="chip">⭐ {product.rating}</span><span className="chip">🛒 {product.sales}</span><span className="chip">💰 {product.price}</span></div></div>
            <button className="primary" onClick={() => setScreen("style")}>Usar este produto →</button>
          </div>}
        </>}

        {screen === "style" && product && <>
          <button className="secondary" onClick={() => setScreen("product")}>← Produto</button><h2>{title}</h2><p className="muted">Escolha um estilo ou deixe a IA decidir.</p>
          <div className="grid section">{styles.map(([icon,name,desc]) => <button key={name} className={`option ${style === name ? "active" : ""}`} onClick={() => setStyle(name)}><strong>{icon} {name}</strong><small>{desc}</small></button>)}</div>
          <div className="card section"><label className="label">DURAÇÃO</label><div className="grid grid-2">{[15,30,45].map((d) => <button key={d} className={`option ${duration===d ? "active" : ""}`} onClick={() => setDuration(d)}><strong>{d}s</strong><small>Vídeo vertical</small></button>)}</div></div>
          <button className="primary section" onClick={createScript}>✨ Gerar criativo</button>
        </>}

        {screen === "generate" && <div className="card" style={{marginTop:40}}><h2>🎬 {title}</h2><p className="muted">{progress < 50 ? "Criando o gancho e roteiro..." : progress < 90 ? "Preparando cenas e CTA..." : "Finalizando seu criativo..."}</p><div className="progress"><div style={{width:`${progress}%`}} /></div><div className="steps"><div className={`step ${progress >= 20 ? "done" : ""}`}><span className="step-dot">✓</span>Estratégia</div><div className={`step ${progress >= 45 ? "done" : ""}`}><span className="step-dot">✓</span>Roteiro</div><div className={`step ${progress >= 70 ? "done" : ""}`}><span className="step-dot">✓</span>Cenas e CTA</div><div className={`step ${progress >= 100 ? "done" : ""}`}><span className="step-dot">✓</span>Pronto</div></div><p className="muted" style={{marginTop:18}}>Nesta primeira versão o robô gera o plano criativo. A renderização MP4 será conectada ao motor de vídeo na próxima etapa.</p></div>}

        {screen === "result" && product && script && <>
          <button className="secondary" onClick={() => setScreen("style")}>← Criar outra versão</button><h2>{title}</h2>
          <div className="video-placeholder"><div className="play">▶</div><strong>{script.hook}</strong><small style={{marginTop:8}}>{product.title}</small></div>
          <div className="card section"><strong>🎯 Gancho</strong><p>{script.hook}</p><strong>📣 CTA</strong><p>{script.cta}</p><strong>📝 Legenda</strong><p className="muted">{script.caption}</p><div className="chips">{script.hashtags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div></div>
          <div className="grid grid-2 section"><button className="secondary" onClick={() => navigator.clipboard?.writeText(script.caption)}>📋 Copiar legenda</button><button className="primary" onClick={() => showMessage("A exportação MP4 será ativada na etapa de renderização.")}>⬇️ Baixar vídeo</button></div>
          <div className="card section"><strong>Roteiro por cenas</strong>{script.scenes.map((scene) => <div key={scene.time} style={{padding:"13px 0", borderBottom:"1px solid #282b35"}}><strong>{scene.time}</strong><p style={{margin:"5px 0"}}>{scene.visual}</p><small className="muted">🎙️ {scene.voice}</small></div>)}</div>
        </>}

        {screen === "videos" && <><h2>{title}</h2><div className="grid grid-2"><div className="card"><div className="product-image">🎬</div><strong>Mini Aspirador</strong><p className="muted">Viral • 27s</p></div><div className="card"><div className="product-image">🎬</div><strong>Luminária LED</strong><p className="muted">UGC • 24s</p></div></div></>}
      </div>
      <nav className="bottomnav"><div className="bottomnav-inner"><button className={`navitem ${screen === "home" ? "active" : ""}`} onClick={() => setScreen("home")}><span className="navicon">🏠</span>Início</button><button className="navitem" onClick={() => showMessage("Biblioteca de produtos entra na próxima etapa.")}><span className="navicon">📦</span>Produtos</button><button className={`navitem ${screen === "videos" ? "active" : ""}`} onClick={() => setScreen("videos")}><span className="navicon">🎬</span>Vídeos</button><button className="navitem" onClick={() => showMessage("Configurações entram na próxima etapa.")}><span className="navicon">⚙️</span>Ajustes</button></div></nav>
    </main>
  );
}
