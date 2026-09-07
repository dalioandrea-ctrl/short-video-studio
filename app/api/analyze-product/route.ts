import { NextResponse } from "next/server";

function clean(value: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function extractMeta(html: string, property: string) {
  const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  return clean(html.match(pattern)?.[1] || null);
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Envie um link completo do produto." }, { status: 400 });
    }

    const isDemo = /produto-demo/i.test(url);
    if (isDemo) {
      return NextResponse.json({ product: {
        title: "Mini Aspirador Portátil 3 em 1",
        price: "R$ 39,90",
        rating: "4,8",
        sales: "10 mil+ vendidos",
        url,
        summary: "Produto visual, fácil de demonstrar e com benefício claro.",
      }});
    }

    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; ShopeeVideoAI/0.1)" }, redirect: "follow", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("A página do produto não respondeu.");
    const html = await response.text();
    const title = extractMeta(html, "og:title") || clean(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "Produto Shopee");
    const image = extractMeta(html, "og:image");
    const description = extractMeta(html, "og:description");

    return NextResponse.json({ product: {
      title,
      price: "Confira na Shopee",
      rating: "—",
      sales: "—",
      url,
      image,
      summary: description || "Produto encontrado. Alguns dados podem depender da disponibilidade da página.",
    }});
  } catch (error) {
    return NextResponse.json({ error: "Não consegui ler os dados deste link. A Shopee pode exigir uma integração oficial ou bloquear a leitura automática. Você ainda pode usar o modo demo para testar o fluxo." }, { status: 422 });
  }
}
