import { articles } from "@/content/articles";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return notFound();
  return (
    <main>
      <article className="article">
        <div className="eyebrow">Resources / Guide</div>
        <h1>{a.title}</h1>
        <p style={{ fontSize: 20 }}>{a.excerpt}</p>
        <h2>Start with the right documents</h2>
        <p>
          Prepare identity information, company details, ownership information
          and any provider-specific documents before starting an application.
        </p>
        <h2>Choose the right account or structure</h2>
        <p>
          Separate personal and business activity, understand who will own the
          entity and confirm the requirements of the provider or state involved.
        </p>
        <h2>Keep compliance visible</h2>
        <p>
          Formation is only the beginning. Maintain records, monitor recurring
          obligations and keep your business information current.
        </p>
        <div className="notice">
          This educational page is a demo replica and is not legal, tax or
          financial advice.
        </div>
      </article>
    </main>
  );
}
