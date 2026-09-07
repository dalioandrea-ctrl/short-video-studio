import OpenAI from "openai";
import { NextResponse } from "next/server";

const demoScript = {
  hook: "Eu não sabia que precisava disso até descobrir esse produto...",
  scenes: [
    { time: "0–3s", visual: "Close rápido no produto + texto grande na tela.", voice: "Olha isso que eu encontrei e que pode facilitar sua rotina." },
    { time: "3–9s", visual: "Mostrar o produto em uso e destacar o benefício principal.", voice: "Ele resolve um problema chato de um jeito simples e prático." },
    { time: "9–18s", visual: "Sequência de 2 a 3 benefícios com cortes rápidos.", voice: "É compacto, fácil de usar e ainda ocupa pouquíssimo espaço." },
    { time: "18–25s", visual: "Mostrar detalhe do produto e a oferta.", voice: "E o melhor é que o preço costuma caber no bolso." },
    { time: "25–30s", visual: "Produto centralizado + CTA na tela.", voice: "Se quiser conferir, toca no link e vê a oferta de hoje." },
  ],
  cta: "Confira o produto pelo seu link de afiliado.",
  caption: "Achei esse produto na Shopee e ele chamou minha atenção pela praticidade. Confira a oferta no link!",
  hashtags: ["#shopee", "#achadinhos", "#ofertas", "#afiliados"],
};

export async function POST(request: Request) {
  try {
    const { product, style, duration } = await request.json();
    if (!product?.title) return NextResponse.json({ error: "Produto inválido." }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ script: demoScript, mode: "demo", warning: "OPENAI_API_KEY não configurada; roteiro demonstrativo usado." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      input: `Você é um roteirista de vídeos curtos para afiliados. Crie um criativo vertical em português brasileiro. Não invente especificações, preço, desconto, avaliações ou resultados não presentes nos dados. Produto: ${JSON.stringify(product)}. Estilo: ${style}. Duração: ${duration}s. Retorne JSON com hook, scenes (time, visual, voice), cta, caption e hashtags. O CTA deve orientar o usuário a conferir o produto no link de afiliado, sem alegações enganosas.`,
    });

    const text = response.output_text;
    const parsed = JSON.parse(text.replace(/^```json\s*/i, "").replace(/\s*```$/i, ""));
    return NextResponse.json({ script: parsed, mode: "openai" });
  } catch (error) {
    return NextResponse.json({ error: "A IA não conseguiu criar o roteiro agora. Verifique a chave OPENAI_API_KEY e tente novamente." }, { status: 500 });
  }
}
