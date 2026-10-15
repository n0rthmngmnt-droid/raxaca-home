// Single source of truth for the catalog.
// Imported by the browser (home + product pages) AND by the Netlify checkout
// function, so prices can never be tampered with from the client.
//
// Prices are in US cents. `stripePriceId` is optional — when set, checkout uses
// that Stripe Price instead of sending the price inline.

export const products = [
  {
    number: "01",
    slug: "weeknight-kitchen",
    title: "The Weeknight Kitchen",
    tagline: "Sixty dinners that take thirty minutes or less, built around what's already in your fridge.",
    priceCents: 2299,
    category: "cooking",
    type: "Cookbook",
    level: "Beginner",
    scope: "60 recipes",
    time: "30 minutes or less",
    equipment: "A pan, a pot, one good knife",
    pages: 118,
    cover: "clay",
    featured: true,
    description: [
      "Weeknight cooking fails for one reason: the recipe assumes you have time, energy and an ingredient you don't. Every dinner here is written for a Tuesday — thirty minutes door to table, one pan where possible, and a swap listed for anything you're likely to be missing.",
      "The book is organised by what you have, not by cuisine: eggs, a tin of beans, half a cabbage, yesterday's rice. Each chapter opens with a five-minute shopping list so one trip covers the week.",
    ],
    includes: [
      "60 dinners, all under 30 minutes, most in one pan",
      "Chapters organised by what's in the fridge",
      "Ingredient swaps on every recipe",
      "Four weekly shopping lists",
      "Metric and US measurements throughout",
    ],
    forWho: "Anyone who cooks on weeknights and is tired of the same four dinners — no technique or special equipment assumed.",
  },
  {
    number: "02",
    slug: "sourdough-handbook",
    title: "The Sourdough Handbook",
    tagline: "From flour and water to a crackling loaf in ten days — on a schedule that fits around work.",
    priceCents: 3499,
    category: "baking",
    type: "Guide + recipes",
    level: "Beginner – Intermediate",
    scope: "1 starter · 14 bakes",
    time: "Weekend-friendly schedule",
    equipment: "Dutch oven, digital scale",
    pages: 96,
    cover: "cream",
    featured: true,
    description: [
      "Most sourdough guides are written for people who are home all day. This one is built around a job: feed the starter before work, mix in the evening, shape before bed, bake on Saturday morning. Every step has a time window, not a time.",
      "The first half gets you a reliable starter and a dependable everyday loaf. The second half branches out — seeded, rye, focaccia, pizza dough and a sandwich loaf that holds together.",
    ],
    includes: [
      "Day-by-day starter guide with troubleshooting",
      "The everyday loaf, with a working-week timetable",
      "13 more bakes: rye, seeded, focaccia, pizza, sandwich loaf",
      "What went wrong: a photo guide to flat, dense and gummy loaves",
      "Baker's percentages explained in one page",
    ],
    forWho: "People who have wanted to bake bread for years and never found a method that survives a working week.",
  },
  {
    number: "03",
    slug: "home-reset",
    title: "The Home Reset",
    tagline: "A four-week, room-by-room system to declutter, organise and set up routines that keep the house tidy on its own.",
    priceCents: 4649,
    category: "organization",
    type: "Workbook",
    level: "All levels",
    scope: "4 weeks · 9 rooms",
    time: "2–3 h per weekend, then 15 min a day",
    equipment: "Boxes, labels, a pen",
    pages: 164,
    cover: "sage",
    featured: true,
    description: [
      "Tidying once is easy; staying tidy is the hard part. The Home Reset is a four-week plan that clears each room in order — entryway, kitchen, bathroom, bedrooms, living room, storage — and then installs the small daily routines that stop the mess coming back.",
      "It's a workbook, not a philosophy: checklists to tick, a decision rule for every object, printable labels, and a one-page weekly reset you'll actually keep doing.",
    ],
    includes: [
      "Four weekend plans covering nine rooms and zones",
      "A keep / move / go decision rule for every category",
      "Daily 15-minute routines and a one-page weekly reset",
      "Printable checklists and labels",
      "Storage planning worksheets for small spaces",
    ],
    forWho: "Households that have tidied many times and want it to stick this time — renters and owners, small flats and family homes.",
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
