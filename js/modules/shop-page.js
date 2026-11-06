import { initCartBadges, initCartPage, initProductDetail } from "./shop.js";
import { siteShellReady } from "./site-shell.js";

await siteShellReady;
initCartBadges();

if (document.body.dataset.shopPage === "detail") initProductDetail();
if (document.body.dataset.shopPage === "cart") initCartPage();
