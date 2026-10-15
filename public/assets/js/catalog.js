// Home page: the three-cover hero and one feature row per guide.

import { products } from "/data/products.js";
import { renderCover } from "./cover.js";
import { renderFeature } from "./card.js";
import { escapeHtml as esc } from "./site.js";
import { initBuyButtons } from "./checkout.js";

function renderTrio() {
  const trio = document.getElementById("hero-trio");
  if (!trio) return;
  // Visual order: left, centre (front), right.
  const [first, second, third] = products;
  trio.innerHTML = [second, first, third]
    .filter(Boolean)
    .map(
      (p) => `
        <a class="trio__item" href="/ebooks/${esc(p.slug)}" tabindex="-1">
          ${renderCover(p)}
        </a>`
    )
    .join("");
}

function renderFeatures() {
  const root = document.getElementById("features");
  if (!root) return;
  root.innerHTML = products.map(renderFeature).join("");
}

function scrollToHashAfterRender() {
  const { hash } = window.location;
  if (!hash) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  // The guides are rendered by JS, so the browser's own fragment jump can land
  // in the wrong place. Re-run it once layout is final and after fonts settle.
  const jump = () => target.scrollIntoView({ behavior: "instant", block: "start" });
  requestAnimationFrame(jump);
  document.fonts?.ready.then(() => requestAnimationFrame(jump));
}

renderTrio();
renderFeatures();
initBuyButtons();
scrollToHashAfterRender();
