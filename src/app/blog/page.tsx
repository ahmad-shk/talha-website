import Link from "next/link";
import { articles } from "@/content/articles";

export default function Blog() {
  return (
    <main>
      <section className="blogHero">
        <div className="container">
          <div className="eyebrow">Resources</div>
          <h1 className="font-display text-[var(--fm-type-hero-size)] font-bold leading-[var(--fm-type-hero-line-height)] tracking-[-0.045em]">
            Guides for international founders.
          </h1>
        </div>
      </section>
      <section className="section">
        <div className="container blogGrid">
          {articles.map((a) => (
            <Link
              className="card blogCard"
              href={"/blog/" + a.slug}
              key={a.slug}
            >
              <div className="eyebrow">Guide</div>
              <h3>{a.title}</h3>
              <p className="muted">{a.excerpt}</p>
              <b>Read article →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}