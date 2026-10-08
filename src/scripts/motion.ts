// Subtiele beweging voor de website. Alles is versiering: zonder JS of met
// "reduced motion" staat de pagina er gewoon, in de eindstand.

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const main = document.querySelector("main");

/** Roept `fn` één keer aan zodra `el` in beeld komt. */
function onceInView(el: Element, fn: () => void, rootMargin = "0px 0px -12% 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          io.disconnect();
          fn();
        }
      }
    },
    { rootMargin, threshold: 0.15 },
  );
  io.observe(el);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------
// Header: schaduw zodra je scrollt
// ---------------------------------------------------------------
const header = document.getElementById("site-header");
if (header) {
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// ---------------------------------------------------------------
// Tekstlinks met "→": het pijltje schuift mee bij hover
// ---------------------------------------------------------------
document.querySelectorAll<HTMLAnchorElement>("main a").forEach((a) => {
  const last = a.lastChild;
  if (last?.nodeType === Node.TEXT_NODE && last.textContent?.trimEnd().endsWith("→")) {
    last.textContent = last.textContent.trimEnd().slice(0, -1);
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    a.append(arrow);
  }
});

// ---------------------------------------------------------------
// Hero: tekst en beeld komen na elkaar op
// ---------------------------------------------------------------
const hero = main?.querySelector<HTMLElement>("[data-hero]");
if (hero && !reduce) {
  const h1 = hero.querySelector("h1");
  const items: Element[] = [];
  if (h1?.parentElement) {
    // Eerst het tekstblok rond de h1, dan van binnen naar buiten wat ernaast staat
    // (productbeeld, formulier).
    let block: Element = h1.parentElement;
    items.push(...Array.from(block.children));
    while (block !== hero && block.parentElement) {
      const parent: Element = block.parentElement;
      for (const sibling of Array.from(parent.children)) if (sibling !== block) items.push(sibling);
      block = parent;
    }
  }
  items.forEach((el, i) => {
    (el as HTMLElement).dataset.heroItem = "";
    (el as HTMLElement).style.setProperty("--d", `${80 + i * 90}ms`);
  });
}

// ---------------------------------------------------------------
// Binnenkomen bij scrollen
// ---------------------------------------------------------------
if (main && !reduce) {
  const selector = [
    "h2",
    "section > div > p",
    "article",
    "figure",
    "details",
    "form",
    "dl",
    "ol > li",
    "ul > li",
    "[role=tablist]",
  ].join(",");

  const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section")).filter(
    (s) => !s.hasAttribute("data-hero"),
  );

  for (const section of sections) {
    const all = Array.from(section.querySelectorAll<HTMLElement>(selector));
    // Alleen het buitenste kandidaat-element animeren, niet ook alles daarbinnen.
    const targets = all.filter(
      (el) =>
        !all.some((other) => other !== el && other.contains(el)) &&
        !el.closest("[role=tabpanel][hidden], .mq-mask, [data-chat]"),
    );
    // Kopjes en hun eyebrow tegelijk met de h2 laten komen.
    for (const el of targets) {
      const prev = el.tagName === "H2" ? el.previousElementSibling : null;
      if (prev && prev.tagName === "SPAN" && !targets.includes(prev as HTMLElement)) {
        targets.push(prev as HTMLElement);
      }
    }

    const groups = new Map<Element | null, HTMLElement[]>();
    for (const el of targets) {
      const key = el.parentElement;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(el);
    }
    for (const group of groups.values()) {
      group.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      group.forEach((el, i) => {
        el.dataset.reveal = "";
        el.style.setProperty("--d", `${Math.min(i, 6) * 70}ms`);
      });
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  main.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
}

// ---------------------------------------------------------------
// De Akkoord-stempel
// ---------------------------------------------------------------
document.querySelectorAll<HTMLElement>("[data-stamp]").forEach((stamp) => {
  if (reduce) {
    stamp.classList.add("is-stamped");
    return;
  }
  // Staat er een Akkoord-knop in dezelfde kaart, dan wordt die eerst ingedrukt.
  const card = stamp.parentElement;
  const button = card
    ? Array.from(card.querySelectorAll<HTMLElement>("span, button")).find(
        (el) => el !== stamp && !stamp.contains(el) && el.textContent?.trim() === "Akkoord" && el.style.background === "rgb(10, 10, 10)",
      )
    : undefined;

  onceInView(
    stamp,
    async () => {
      await wait(700);
      if (button) {
        button.classList.add("is-pressed");
        await wait(220);
      }
      stamp.classList.add("is-stamped");
    },
    "0px 0px -20% 0px",
  );
});

// ---------------------------------------------------------------
// Doorlaatregeling: van Voorstellen, via Steekproef, naar de ingestelde stand
// ---------------------------------------------------------------
const STANDEN = ["Voorstellen", "Steekproef", "Automatisch"];
const segs = Array.from(document.querySelectorAll<HTMLElement>("main span, main div")).filter((el) => {
  const kids = Array.from(el.children) as HTMLElement[];
  return kids.length === 3 && kids.every((k, i) => k.textContent?.trim() === STANDEN[i]);
});
segs.forEach((seg, n) => {
  const kids = Array.from(seg.children) as HTMLElement[];
  const target = kids.findIndex((k) => k.style.fontWeight === "500");
  if (target <= 0 || reduce) return;
  seg.dataset.seg = "";
  const on = kids[target].style.cssText;
  const off = kids[target === 0 ? 1 : 0].style.cssText;
  const show = (i: number) => kids.forEach((k, j) => (k.style.cssText = j === i ? on : off));
  show(0);
  onceInView(seg, async () => {
    await wait(500 + n * 120);
    for (let i = 1; i <= target; i++) {
      show(i);
      await wait(520);
    }
  });
});

// ---------------------------------------------------------------
// Balkjes lopen vol (zekerheid 82%)
// ---------------------------------------------------------------
document.querySelectorAll<HTMLElement>("main span[style*='height: 6px'] > span[style*='width:']").forEach((bar) => {
  if (reduce) return;
  bar.dataset.fill = "";
  onceInView(bar, () => bar.classList.add("is-in"));
});

// ---------------------------------------------------------------
// Het rondje: een rustig lichtje dat de stappen langsloopt
// ---------------------------------------------------------------
document.querySelectorAll<HTMLElement>("[data-rondje]").forEach((list) => {
  if (reduce) return;
  const steps = Array.from(list.children).filter((li) => li.getAttribute("aria-hidden") !== "true");
  let i = 0;
  let timer: number | undefined;
  const tick = () => {
    steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
    i = (i + 1) % steps.length;
  };
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && timer === undefined) {
      tick();
      timer = window.setInterval(tick, 1500);
    } else if (!entry.isIntersecting && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  }).observe(list);
});

// ---------------------------------------------------------------
// Gesprekken: berichten komen na elkaar binnen
// ---------------------------------------------------------------
document.querySelectorAll<HTMLElement>("[data-chat]").forEach((chat) => {
  const messages = Array.from(chat.children);
  if (reduce) {
    messages.forEach((m) => m.classList.add("is-in"));
    return;
  }
  onceInView(chat, async () => {
    for (const m of messages) {
      m.classList.add("is-in");
      await wait(420);
    }
  });
});

// Knipperende cursor in de invoervelden van de assistenten
document.querySelectorAll<HTMLElement>("main span").forEach((el) => {
  const t = el.textContent?.trim() ?? "";
  if (el.children.length === 0 && /^(Vraag me alles|Stel je vraag|Typ je vraag)/.test(t)) {
    el.classList.add("caret");
  }
});

// ---------------------------------------------------------------
// Zaaktype-tabs
// ---------------------------------------------------------------
const tablist = document.querySelector<HTMLElement>("[role=tablist]");
if (tablist) {
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.style.background = active ? "#0A0A0A" : "transparent";
      tab.style.color = active ? "#FFFFFF" : "#3F3F46";
      const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");
      if (!panel) return;
      panel.hidden = !active;
      if (active) {
        panel.classList.remove("is-entering");
        void panel.offsetWidth;
        panel.classList.add("is-entering");
      }
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const keys: Record<string, number> = {
        ArrowRight: (i + 1) % tabs.length,
        ArrowLeft: (i - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (e.key in keys) {
        e.preventDefault();
        select(keys[e.key], true);
      }
    });
  });
}

// ---------------------------------------------------------------
// Oude blogpagina's gebruiken nog AOS-attributen
// ---------------------------------------------------------------
if (document.querySelector("[data-aos]")) {
  Promise.all([import("aos"), import("aos/dist/aos.css")]).then(([{ default: AOS }]) => AOS.init());
}
