# AEO Audit & Implementatieplan — insync.insure

> **Doel van dit document**: actionable briefing voor Claude Code om de website `insync.insure` (Astro + Netlify) te optimaliseren voor Answer Engine Optimization (AEO). Elke sectie bevat concrete bestanden, code-snippets en acceptatiecriteria.

**Audit datum**: 1 mei 2026
**Stack**: Astro (static), Netlify image CDN
**Gevonden pagina's**: Home, Oplossingen (Klantportaal, Afsluitstraat, Insync AI, Voorwaarden Vergelijker), Blog, Contact, Demo, Privacybeleid
**Taalcontext**: NL-NL (Nederland, verzekeringsbranche, B2B SaaS voor advieskantoren)

---

## TL;DR — Prioriteitenmatrix

| Prio | Item | Impact | Effort |
|------|------|--------|--------|
| P0 | Schema.org structured data (Organization, SoftwareApplication, FAQPage) | Hoog | Laag |
| P0 | FAQ-secties op product- en homepagina | Hoog | Middel |
| P0 | Meta descriptions + OG tags per pagina | Hoog | Laag |
| P0 | `robots.txt` + `sitemap.xml` + `llms.txt` | Hoog | Laag |
| P1 | "Wat is..."-uitleg op productpagina's (extractable answers) | Hoog | Middel |
| P1 | Glossary / kennisbank voor branche-termen | Middel | Hoog |
| P1 | Author/E-E-A-T markup op blogs | Middel | Laag |
| P2 | Vergelijkingstabel-pagina's (Insync vs. Anva, Insync vs. Novulo features) | Hoog | Hoog |
| P2 | Case study schema markup | Middel | Middel |
| P2 | Internal linking uitbreiden (3-5 per pagina) | Middel | Laag |

---

## 1. Bevindingen huidige staat

### Wat goed is
- Heldere positionering: "AI-tools voor adviseurs en digitale oplossingen voor hun klanten"
- Logische informatiearchitectuur (Voor klanten / Voor kantoren splitsing)
- Concrete waardepropositie ("tot 30% minder herhaalvragen")
- Mobielvriendelijke navigatie en duidelijke CTA's
- Astro = goede technische basis (snelle, statische HTML — ideaal voor crawlers)

### Wat ontbreekt voor AEO
1. **Geen zichtbare structured data** (JSON-LD schema's) — AI-engines hebben hier moeite mee om context op te bouwen
2. **Geen FAQ-secties** — dit is de #1 pattern die LLMs citeren
3. **Geen "Wat is X?"-blokken** — antwoord-engines pakken de eerste 40-60 woorden onder een vraag-heading
4. **Korte productpagina's** — weinig substantie voor AI om te citeren; voornamelijk marketing-claims zonder onderbouwing
5. **Geen `llms.txt`** — opkomende standaard voor AI-crawlers
6. **Beperkte interne linking** tussen blog en productpagina's
7. **Geen author bylines / E-E-A-T signalen** op blogposts (geen zichtbaarheid op auteur, datum-update, expertise)
8. **Geen vergelijkingscontent** — terwijl jullie integraties hebben met Anva en Novulo (sterke long-tail-kans)
9. **Ontbrekende meta descriptions** in de gefetchte HTML — AI-engines gebruiken deze als snippets

---

## 2. Concrete taken voor Claude Code

### TAAK 1 — Structured Data (JSON-LD) toevoegen

**Bestanden aanmaken/aanpassen**: `src/components/StructuredData.astro` + integreren in `src/layouts/BaseLayout.astro`

#### 1a. Organization schema (in `BaseLayout.astro`, op elke pagina)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Insync",
  "legalName": "Insync",
  "url": "https://insync.insure",
  "logo": "https://insync.insure/logo.svg",
  "description": "AI-tools voor verzekeringsadviseurs en digitale oplossingen voor hun klanten. Klantportaal, afsluitstraat, AI-backoffice-assistent en polisvoorwaarden vergelijker.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+31-6-18282389",
    "email": "hello@insync.insure",
    "contactType": "sales",
    "availableLanguage": ["Dutch", "English"],
    "areaServed": "NL"
  },
  "sameAs": [
    "https://www.linkedin.com/company/insync-platform"
  ],
  "knowsAbout": [
    "Verzekeringssoftware",
    "InsurTech",
    "Klantportaal verzekeringen",
    "AI voor verzekeringsadviseurs",
    "Polisvoorwaarden vergelijken",
    "Backoffice automatisering"
  ]
}
</script>
```

#### 1b. SoftwareApplication schema (per productpagina)

Voorbeeld voor `src/pages/oplossingen/insync-ai.astro`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Insync AI",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Insurance Backoffice Assistant",
  "operatingSystem": "Web",
  "description": "AI-assistent voor verzekeringsadviseurs die via chat of spraak rechtstreeks communiceert met de backoffice (Anva, Novulo) via een beveiligde MCP-server.",
  "featureList": [
    "Backoffice chat in natuurlijke taal",
    "Spraakgestuurde administratie",
    "MCP-server integratie met Anva en Novulo",
    "Meertalige ondersteuning"
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://insync.insure/demo"
  },
  "provider": {
    "@type": "Organization",
    "name": "Insync",
    "url": "https://insync.insure"
  }
}
</script>
```

Doe dit voor alle vier productpagina's (Klantportaal, Afsluitstraat, Insync AI, Voorwaarden Vergelijker).

#### 1c. BreadcrumbList op subpagina's

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://insync.insure/" },
    { "@type": "ListItem", "position": 2, "name": "Oplossingen", "item": "https://insync.insure/oplossingen" },
    { "@type": "ListItem", "position": 3, "name": "Insync AI", "item": "https://insync.insure/oplossingen/insync-ai" }
  ]
}
</script>
```

#### 1d. Article schema op blogposts

Aanpassen in de blog-layout (waarschijnlijk `src/layouts/BlogPost.astro` of `src/pages/blog/[slug].astro`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{title}}",
  "description": "{{description}}",
  "image": "{{image}}",
  "datePublished": "{{publishDate}}",
  "dateModified": "{{updateDate || publishDate}}",
  "author": {
    "@type": "Person",
    "name": "{{authorName}}",
    "jobTitle": "{{authorRole}}",
    "url": "https://insync.insure/team/{{authorSlug}}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Insync",
    "logo": { "@type": "ImageObject", "url": "https://insync.insure/logo.svg" }
  },
  "mainEntityOfPage": "{{canonicalUrl}}"
}
</script>
```

**Acceptatiecriteria**:
- [ ] Schema valideert in [validator.schema.org](https://validator.schema.org/) zonder errors
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) geeft groen voor minimaal Organization en Article

---

### TAAK 2 — FAQ-secties toevoegen met FAQPage schema

Voeg onderaan elke productpagina én op de homepage een `<FAQ />`-component toe.

**Component**: `src/components/Faq.astro`

```astro
---
interface FaqItem {
  question: string;
  answer: string;
}
const { items, pageTitle } = Astro.props as { items: FaqItem[]; pageTitle: string };
---

<section class="faq" aria-labelledby="faq-heading">
  <h2 id="faq-heading">Veelgestelde vragen over {pageTitle}</h2>
  <div class="faq-list">
    {items.map((item) => (
      <details class="faq-item">
        <summary><h3>{item.question}</h3></summary>
        <div class="faq-answer">
          <p>{item.answer}</p>
        </div>
      </details>
    ))}
  </div>
</section>

<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": { "@type": "Answer", "text": item.answer }
  }))
})} />
```

#### Voorgestelde FAQ-content per pagina

**Homepage** (`src/pages/index.astro`):
```js
const homeFaqs = [
  {
    question: "Wat is Insync?",
    answer: "Insync is een Nederlands platform met AI-tools voor verzekeringsadviseurs en digitale klantoplossingen. Het bestaat uit vier modules: een klantportaal, een digitale afsluitstraat, een AI-backoffice-assistent (Insync AI) en een AI-gestuurde polisvoorwaarden vergelijker. Insync koppelt naadloos met backoffice-systemen zoals Anva en Novulo."
  },
  {
    question: "Voor wie is Insync bedoeld?",
    answer: "Insync is ontwikkeld voor verzekeringsadvies­kantoren volmachten en verzekeraars in Nederland die hun administratie willen automatiseren en hun klanten een modern digitaal portaal willen aanbieden. Onafhankelijk van het formaat."
  },
  {
    question: "Met welke backoffice-systemen koppelt Insync?",
    answer: "Insync koppelt onder meer met Novulo, Anva en binnenkort ook CCS. Door realtime-integratie blijft klantdata altijd actueel en hoeven adviseurs niets dubbel in te voeren."
  },
  {
    question: "Hoe snel kan Insync worden geïmplementeerd?",
    answer: "Insync is modulair opgebouwd en snel implementeerbaar. Kantoren kiezen alleen de modules die ze nodig hebben en kunnen later uitbreiden. Een implementatietraject begint doorgaans met een demo waarin de specifieke situatie wordt besproken."
  },
  {
    question: "Is Insync veilig en compliant?",
    answer: "Ja. Insync werkt met realtime data vanuit de bestaande backoffice via beveiligde verbindingen. Insync AI gebruikt moderne technieken zodat data in de eigen backoffice blijft en niet naar externe AI-providers gaat."
  }
];
```

**Insync AI pagina**:
```js
const insyncAiFaqs = [
  {
    question: "Wat is Insync AI?",
    answer: "Insync AI is een AI-assistent voor verzekeringsadviseurs die via chat of spraak rechtstreeks acties uitvoert in de backoffice. Adviseurs kunnen klantgegevens opzoeken, wijzigingen doorvoeren en administratieve taken afhandelen via natuurlijke taal in plaats van handmatig te klikken in het backoffice-systeem."
  },
  {
    question: "Hoe werkt de MCP-server van Insync AI?",
    answer: "Insync AI maakt gebruik van een MCP-server (Model Context Protocol) die als beveiligde brug fungeert tussen de AI-assistent en de backoffice. De data verlaat het backoffice-systeem niet; alleen geautoriseerde acties worden via de MCP-server uitgevoerd."
  },
  {
    question: "Welke talen ondersteunt Insync AI?",
    answer: "Insync AI is meertalig en kan in meerdere talen worden aangesproken en antwoorden. De primaire taal voor de Nederlandse markt is Nederlands."
  },
  {
    question: "Werkt Insync AI met Anva en Novulo?",
    answer: "Ja. Insync AI is gebouwd om bovenop bestaande backoffice-systemen zoals Anva en Novulo te werken via de MCP-server-architectuur. Binnenkort voegen we ook een CCS koppeling toe."
  }
];
```

**Voorwaarden Vergelijker**:
```js
const vergelijkerFaqs = [
  {
    question: "Hoe werkt de AI Voorwaarden Vergelijker?",
    answer: "De Voorwaarden Vergelijker analyseert geüploade polisdocumenten (PDF) automatisch. De AI herkent verzekeraar, producttype en dekking, en stelt een vergelijkingstabel samen. Adviseurs kunnen vervolgens via een chat specifieke dekkingsvragen stellen en krijgen antwoorden met directe bronvermelding naar de polis."
  },
  {
    question: "Welke documenten kan de Voorwaarden Vergelijker verwerken?",
    answer: "Het systeem verwerkt PDF-documenten met polisvoorwaarden van Nederlandse verzekeraars. De AI herkent automatisch het type verzekering en relevante dekkingen."
  },
  {
    question: "Geeft de AI bronvermelding bij antwoorden?",
    answer: "Ja. Bij elk antwoord op een dekkingsvraag verwijst de Voorwaarden Vergelijker naar de exacte passage in de polisvoorwaarden waar het antwoord op is gebaseerd."
  },
  {
    question: "Kun je polissen van verschillende verzekeraars vergelijken?",
    answer: "Ja. Dat is de kernfunctionaliteit. Polissen worden naast elkaar gezet in een overzichtelijke vergelijkingstabel met duidelijke symbolen voor dekking, uitsluitingen en verschillen."
  }
];
```

Werk hetzelfde patroon uit voor **Klantportaal** en **Afsluitstraat**.

**Acceptatiecriteria**:
- [ ] FAQ-component is herbruikbaar en accepteert items als prop
- [ ] FAQPage JSON-LD wordt automatisch gegenereerd uit dezelfde data
- [ ] Antwoorden zijn 40-100 woorden (sweet spot voor AI-extractie)
- [ ] Vragen beginnen met "Wat", "Hoe", "Voor wie", "Wanneer", "Waarom" of "Kun je"

---

### TAAK 3 — "Wat is X?"-blokken bovenaan productpagina's

LLMs scannen de eerste sectie onder de H1 voor extracteerbare definities. Voeg op elke productpagina direct na de hero een `<DefinitionBlock />` toe.

**Patroon** (voor `oplossingen/insync-ai.astro`):

```astro
<section class="definition" aria-label="Wat is Insync AI">
  <h2>Wat is Insync AI?</h2>
  <p class="lede">
    <strong>Insync AI is een AI-assistent voor verzekeringsadviseurs</strong>
    die rechtstreeks communiceert met de backoffice via chat of spraak.
    De assistent voert administratieve handelingen uit, zoekt klantgegevens
    op en wijzigt polisinformatie — allemaal via natuurlijke taal.
    Insync AI werkt bovenop bestaande backoffice-systemen zoals Anva en
    Novulo via een beveiligde MCP-server (Model Context Protocol),
    waardoor data in het bestaande systeem blijft.
  </p>
</section>
```

**Belangrijk format-recept** dat AI-engines belonen:
- 1e zin = definitie volgens patroon "X is een [categorie] die [doet wat]"
- 2e-3e zin = onderscheidende kenmerken
- 4e zin = technische / contextuele details
- Totaal: 50-80 woorden
- Geen marketing-jargon; feitelijk

**Acceptatiecriteria**:
- [ ] Op elke productpagina staat een `<h2>Wat is [Product]?</h2>` direct na de hero
- [ ] De eerste paragraaf bevat een definitie-zin volgens bovenstaand patroon
- [ ] Geen lege buzzwords ("revolutionair", "next-gen", "game-changing")

---

### TAAK 4 — Meta tags & Open Graph per pagina

Maak een centrale `SEO`-component aan: `src/components/SEO.astro`

```astro
---
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  keywords?: string[];
}
const { title, description, ogImage = "/og-default.png", canonical, keywords = [] } = Astro.props;
const fullTitle = title.includes("Insync") ? title : `${title} – Insync`;
const canonicalUrl = canonical || Astro.url.href;
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
{keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
<link rel="canonical" href={canonicalUrl} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={new URL(ogImage, Astro.site).href} />
<meta property="og:locale" content="nl_NL" />
<meta property="og:site_name" content="Insync" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(ogImage, Astro.site).href} />

<!-- Crawlers -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
```

**Per-pagina meta description voorstellen** (max 155 tekens, met core keyword):

| Pagina | Voorstel description |
|--------|----------------------|
| Home | Insync biedt AI-tools voor verzekeringsadviseurs en digitale oplossingen voor hun klanten. Klantportaal, afsluitstraat, AI-backoffice. Plan een demo. |
| Klantportaal | Geef klanten van je advieskantoor een veilig digitaal portaal voor verzekeringen, documenten en schades. 30% minder herhaalvragen. |
| Afsluitstraat | Laat klanten online verzekeringen aanvragen en afsluiten. Aanvragen worden automatisch verwerkt in je backoffice — zonder extra handwerk. |
| Insync AI | AI-assistent voor verzekeringsadviseurs die via chat of spraak werkt met je backoffice. Koppelt veilig met Anva en Novulo via MCP-server. |
| Voorwaarden Vergelijker | Vergelijk polisvoorwaarden automatisch met AI. Upload PDF's, krijg vergelijkingstabellen en stel dekkingsvragen met directe bronvermelding. |
| Blog | Inzichten en tips over digitalisering in de verzekeringsbranche, AI voor adviseurs en updates over het Insync platform. |
| Contact | Vragen over Insync? Neem contact op via telefoon, WhatsApp of e-mail, of plan direct een demo in. |

**Acceptatiecriteria**:
- [ ] Elke pagina heeft een unieke `<title>` en `<meta description>`
- [ ] OG image van 1200x630px aanwezig (`/public/og-default.png` + per-pagina varianten waar relevant)
- [ ] Canonical URL is gezet
- [ ] `lang="nl"` staat op de `<html>`-tag

---

### TAAK 5 — `robots.txt`, `sitemap.xml` en `llms.txt`

#### 5a. `public/robots.txt`

```
User-agent: *
Allow: /

# Expliciet AI-crawlers toestaan
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://insync.insure/sitemap-index.xml
```

#### 5b. Sitemap via `@astrojs/sitemap`

Installeer en configureer in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://insync.insure',
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'nl', locales: { nl: 'nl-NL' } },
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

#### 5c. `public/llms.txt` (opkomende standaard)

```
# Insync

> Insync biedt AI-tools voor verzekeringsadviseurs en digitale oplossingen voor hun klanten in Nederland. Het platform omvat een klantportaal, digitale afsluitstraat, AI-backoffice-assistent en polisvoorwaarden vergelijker, en koppelt naadloos met backoffice-systemen zoals Anva en Novulo.

## Producten

- [Klantportaal](https://insync.insure/oplossingen/klantportaal): Digitaal portaal waar verzekeringsklanten zelf hun verzekeringen, documenten en schades kunnen inzien.
- [Afsluitstraat](https://insync.insure/oplossingen/afsluitstraat): Digitale flow waarmee klanten online verzekeringen aanvragen en afsluiten; aanvragen worden automatisch in de backoffice verwerkt.
- [Insync AI](https://insync.insure/oplossingen/insync-ai): AI-assistent die via chat of spraak rechtstreeks acties uitvoert in de backoffice (Anva, Novulo) via een beveiligde MCP-server.
- [Voorwaarden Vergelijker](https://insync.insure/oplossingen/voorwaarden-vergelijker): AI-tool die polisvoorwaarden automatisch analyseert, vergelijkt en samenvat met directe bronvermelding.

## Bedrijf

- [Blog](https://insync.insure/blog): Inzichten over digitalisering in de verzekeringsbranche.
- [Contact](https://insync.insure/contact): Contactgegevens en demo-aanvraag.
- [Privacybeleid](https://insync.insure/privacybeleid)

## Doelgroep

Verzekeringsadvieskantoren en intermediairs in Nederland.
```

**Acceptatiecriteria**:
- [ ] `https://insync.insure/robots.txt` is bereikbaar en bevat AI-bots
- [ ] `https://insync.insure/sitemap-index.xml` werkt en bevat alle pagina's
- [ ] `https://insync.insure/llms.txt` is bereikbaar
- [ ] Sitemap is ingediend bij Google Search Console en Bing Webmaster Tools

---

### TAAK 6 — Author / E-E-A-T markup op blog

Maak per auteur een `src/content/authors/[slug].md` met:

```yaml
---
name: "Voornaam Achternaam"
role: "Functie / Expertise"
bio: "1-2 zinnen over relevante ervaring in verzekeringen of tech."
linkedin: "https://www.linkedin.com/in/..."
slug: "voornaam-achternaam"
---
```

In de blog-layout:
```astro
<div class="author-card" itemscope itemtype="https://schema.org/Person">
  <span itemprop="name">{author.name}</span>
  <span itemprop="jobTitle">{author.role}</span>
  <a itemprop="url" href={`https://insync.insure/team/${author.slug}`}>Profiel</a>
</div>
<time datetime={publishDate} itemprop="datePublished">
  Gepubliceerd: {formatDate(publishDate)}
</time>
{updateDate && (
  <time datetime={updateDate} itemprop="dateModified">
    Bijgewerkt: {formatDate(updateDate)}
  </time>
)}
```

**Acceptatiecriteria**:
- [ ] Elke blogpost toont auteursnaam, rol en publicatiedatum zichtbaar boven of onder de titel
- [ ] Author schema is gekoppeld aan Article schema (zie Taak 1d)
- [ ] `/team/[slug]` pagina bestaat per auteur (kan minimaal: naam, foto, bio, LinkedIn)

---

### TAAK 7 — Nieuwe content: vergelijkings- en kennispagina's

Dit is de grootste AEO-kans. AI-engines worden bevraagd met "Insync vs Anva", "wat is een MCP server in verzekeringen", "klantportaal verzekeringsadvies vergelijken" — als jullie die pagina's niet hebben, gaat een concurrent of generieke bron met de citatie aan de haal.

#### 7a. Pagina's om te bouwen

| URL | Type | Hook |
|-----|------|------|
| `/vergelijken/insync-vs-anva` | Comparison | "Hoe werkt Insync samen met Anva?" |
| `/vergelijken/insync-vs-novulo` | Comparison | "Hoe werkt Insync samen met Novulo?" |
| `/kennisbank/wat-is-een-klantportaal` | Glossary | Definitie + use cases voor verzekeringskantoren |
| `/kennisbank/wat-is-een-afsluitstraat` | Glossary | Branche-term uitleg |
| `/kennisbank/mcp-server-verzekeringen` | Technical explainer | Waarom MCP voor backoffice-AI |
| `/kennisbank/polisvoorwaarden-vergelijken` | How-to | Met en zonder AI |
| `/cases/du-gardijn` | Case study | Promoot reeds bestaande blogpost als case |

#### 7b. Template per kennispagina

```markdown
# Wat is een klantportaal voor verzekeringsklanten?

Een klantportaal is een beveiligde online omgeving waar verzekeringsklanten
zelf hun verzekeringen, polisdocumenten en lopende schades kunnen inzien
en beheren — zonder telefonisch contact met hun adviseur.

## Hoe werkt een klantportaal?
[40-60 woorden]

## Voor wie is een klantportaal bedoeld?
[40-60 woorden]

## Wat zijn de voordelen voor een advieskantoor?
[Lijst van 4-6 punten]

## Wat zijn de voordelen voor de klant?
[Lijst van 4-6 punten]

## Hoe verschilt het Insync klantportaal van alternatieven?
[Hier link naar productpagina]

## Veelgestelde vragen over klantportalen
[FAQ sectie met FAQPage schema]
```

Elke pagina krijgt het volledige schema-pakket (Article + FAQPage + BreadcrumbList).

**Acceptatiecriteria**:
- [ ] Minimaal 4 kennisbank-pagina's gepubliceerd
- [ ] Elke pagina volgt het H2-vraagpatroon
- [ ] Interne linking: minimaal 3 links naar productpagina's per kennispagina
- [ ] Eerste paragraaf is altijd een definitie van 40-60 woorden

---

### TAAK 8 — Internal linking + anchor tekst

Bouw automatisch contextuele links uit blog → product → kennisbank. Dit versterkt zowel SEO als het pad dat AI-crawlers afleggen.

**Regels**:
- Elke blogpost: minimaal 2 links naar productpagina's, 1 naar kennisbank
- Elke productpagina: minimaal 1 link naar gerelateerd blog-artikel + 2 links naar kennisbank-glossary-termen
- Anchor tekst beschrijvend (bv. "AI voor backoffice-administratie"), niet "klik hier"

**Implementatie-suggestie**: maak een `src/data/internalLinks.ts` met curated link-mappings, en een `<RelatedContent />`-component die onderaan elke pagina 3 relevante links toont.

---

### TAAK 9 — Performance & technical hygiene

AEO-engines deprioriteren langzame pagina's. Quick wins:

- [ ] Verifieer Lighthouse-score (target: Performance ≥ 90, SEO = 100)
- [ ] `loading="lazy"` op alle below-the-fold images
- [ ] `width` en `height` attributen op alle `<img>` (CLS = 0)
- [ ] Preconnect naar Netlify image CDN: `<link rel="preconnect" href="https://insync.insure/.netlify" />`
- [ ] HTTP security headers via `_headers` (Netlify): `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`
- [ ] `lang="nl"` op `<html>` (controleer)

---

### TAAK 10 — Tracking & meetbaar maken

Voeg in GA4 (of het analytics-platform dat in gebruik is) een **Custom Channel Group** toe voor AEO-traffic. Regex-patroon voor de bekende referrers:

```
chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|bing\.com/copilot|you\.com
```

**KPI's om wekelijks te volgen**:
1. Aantal sessies vanuit AI-engines (uit Custom Channel Group)
2. Aantal indexed pages in Google Search Console
3. Aantal keren dat `insync.insure` als bron wordt geciteerd in handmatige tests via ChatGPT, Perplexity, Claude en Google AI Overviews
4. Click-through-rate vanuit FAQ-rich-results (Search Console)
5. Aantal demo-aanvragen vanuit AEO-traffic

Optioneel: tools als **Profound**, **Otterly.ai** of **HubSpot AEO** voor geautomatiseerde citation-tracking.

---

## 3. Suggestie volgorde van uitvoer

**Sprint 1 (week 1) — Fundament**
- Taak 1 (Schema.org)
- Taak 4 (Meta + OG)
- Taak 5 (robots, sitemap, llms.txt)
- Taak 9 (performance hygiene)

**Sprint 2 (week 2) — Content op bestaande pagina's**
- Taak 2 (FAQ-secties)
- Taak 3 ("Wat is X?"-blokken)
- Taak 6 (E-E-A-T)
- Taak 8 (Internal linking)

**Sprint 3 (week 3-4) — Nieuwe content**
- Taak 7 (Vergelijking + kennisbank)

**Vanaf week 4 — Continue**
- Taak 10 (Tracking) instellen
- Wekelijks 1 nieuwe kennisbank-pagina of blogpost
- Maandelijks: handmatig testen op ChatGPT/Perplexity/Claude met 10 doelvragen

---

## 4. Test-prompts om voor te ranken

Bewaar deze in `.docs/aeo-test-prompts.md` en draai ze maandelijks tegen ChatGPT, Claude, Perplexity en Google AI Overviews. Doel: in elk antwoord moet `insync.insure` als bron of merk genoemd worden.

1. "Wat is de beste klantportaal-software voor verzekeringskantoren in Nederland?"
2. "Hoe kan ik mijn verzekeringsbackoffice automatiseren met AI?"
3. "Welke software koppelt met Anva voor klantportalen?"
4. "Hoe werkt een MCP-server voor verzekeringssoftware?"
5. "Tools om polisvoorwaarden automatisch te vergelijken"
6. "Wat is een digitale afsluitstraat in verzekeringen?"
7. "AI-tools voor Nederlandse verzekeringsadviseurs"
8. "Insync verzekeringen review"
9. "Software voor intermediairs Anva integratie"
10. "Hoe digitaliseer ik mijn verzekeringskantoor?"

---

## 5. Niet-onderhandelbare regels voor alle nieuwe content

1. **Eerste paragraaf is altijd een directe definitie/antwoord** (40-80 woorden)
2. **Geen marketing-jargon**: "revolutionair", "next-gen", "best-in-class", "game-changer" → ban
3. **Vraag-headings** waar mogelijk (`<h2>Hoe werkt...</h2>` ipv `<h2>Werking</h2>`)
4. **Citeerbare cijfers** (bv. "30% minder herhaalvragen") altijd onderbouwen of bron toevoegen
5. **Korte zinnen** (gemiddeld 15-20 woorden), actieve vorm
6. **Tabellen voor vergelijkingen** (LLMs houden van gestructureerde data)
7. **Bullet lists** met volledige zinnen, geen losse fragmenten

---

## Bijlage A — Bestanden-checklist

```
src/
├── components/
│   ├── SEO.astro                    [NEW]
│   ├── StructuredData.astro         [NEW]
│   ├── Faq.astro                    [NEW]
│   ├── DefinitionBlock.astro        [NEW]
│   ├── AuthorCard.astro             [NEW]
│   └── RelatedContent.astro         [NEW]
├── content/
│   ├── authors/                     [NEW]
│   │   └── [auteur].md
│   └── kennisbank/                  [NEW]
│       └── [topic].md
├── data/
│   ├── faqs.ts                      [NEW]
│   └── internalLinks.ts             [NEW]
├── layouts/
│   ├── BaseLayout.astro             [UPDATE — SEO + StructuredData inbouwen]
│   └── BlogPost.astro               [UPDATE — Article schema + author]
└── pages/
    ├── index.astro                  [UPDATE — FAQ + meta]
    ├── oplossingen/
    │   ├── klantportaal.astro       [UPDATE]
    │   ├── afsluitstraat.astro      [UPDATE]
    │   ├── insync-ai.astro          [UPDATE]
    │   └── voorwaarden-vergelijker.astro [UPDATE]
    ├── kennisbank/                  [NEW]
    │   └── [...slug].astro
    ├── vergelijken/                 [NEW]
    │   └── [...slug].astro
    └── team/                        [NEW]
        └── [slug].astro

public/
├── robots.txt                       [NEW]
├── llms.txt                         [NEW]
├── og-default.png                   [NEW — 1200x630]
└── _headers                         [NEW — Netlify security headers]

astro.config.mjs                     [UPDATE — sitemap integration]
```

---

## Bijlage B — Verwijzingen

- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [llms.txt voorstel](https://llmstxt.org/)
- [Astro Sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

---

*Vragen of onduidelijkheden? Pas dit document direct aan in de PR — dit is een levend document.*
