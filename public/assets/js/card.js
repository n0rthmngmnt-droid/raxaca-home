// Markup for the home-page guide features and the small "other guides" cards
// on product pages.

import { formatPrice } from "/data/products.js";
import { renderCover } from "./cover.js";
import { escapeHtml as esc } from "./site.js";

export function priceMarkup(product, suffix = "USD") {
  const compare = product.compareAtCents
    ? `<s class="price__compare">${formatPrice(product.compareAtCents)}</s>`
    : "";
  return `<div class="price">${compare}${formatPrice(product.priceCents)}<small>${esc(suffix)}</small></div>`;
}

export function renderFeature(product, index) {
  const flip = index % 2 === 1 ? " feature--flip" : "";
  const highlights = product.includes.slice(0, 3);
  return `
    <article class="feature${flip}" id="guide-${esc(product.slug)}">
      <a class="feature__media" href="/ebooks/${esc(product.slug)}" aria-label="${esc(product.title)}">
        ${renderCover(product)}
      </a>
      <div class="feature__body">
        <p class="eyebrow eyebrow--accent">No. ${esc(product.number)} &middot; ${esc(product.type)}</p>
        <h3 class="display h-l feature__title"><a href="/ebooks/${esc(product.slug)}">${esc(product.title)}</a></h3>
        <p class="lead">${esc(product.tagline)}</p>
        <ul class="feature__list">
          ${highlights.map((item) => `<li>${esc(item)}</li>`).join("")}
        </ul>
        <p class="feature__specs">${esc(product.scope)} &middot; ${esc(product.time)} &middot; ${esc(product.pages)} pages &middot; PDF</p>
        <div class="feature__buy">
          ${priceMarkup(product)}
          <button class="btn btn--accent" type="button" data-buy="${esc(product.slug)}">
            Buy now <span class="btn__arrow">&rarr;</span>
          </button>
          <a class="btn btn--ghost" href="/ebooks/${esc(product.slug)}">What's inside</a>
        </div>
      </div>
    </article>`;
}

export function renderMini(product) {
  return `
    <article class="mini">
      ${renderCover(product, { mini: true })}
      <div>
        <h3 class="mini__title"><a href="/ebooks/${esc(product.slug)}">${esc(product.title)}</a></h3>
        <p class="mini__tagline">${esc(product.tagline)}</p>
        ${priceMarkup(product)}
      </div>
    </article>`;
}
