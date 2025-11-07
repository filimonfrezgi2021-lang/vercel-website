import React, { useEffect, useMemo, useState } from "react";
import rebuildImg from "figma:asset/a8737163fac50fd326e828eca94bbdcf1d65e01a.png";
import refineImg from "figma:asset/60df0dc9d05a8f189da6809d8494c079ad5604e9.png";
import radiateImg from "figma:asset/6b72bc95cba2ccf5c30677e2bc7aaf602d765724.png";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

/* ----------------------- DESIGN TOKENS ----------------------- */
const tokens = {
  colors: {
    obsidian: "#0B0B0B",
    ivory: "#F7F3EE",
    chalk: "#FAF8F5",
    antiqueGold: "#BFA76B",
    textStrong: "rgba(11,11,11,0.85)",
    textBody: "rgba(11,11,11,0.80)",
    goldHairline: "rgba(191,167,107,0.25)"
  },
  fonts: { headline: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  easing: "cubic-bezier(0.16, 1, 0.3, 1)"
};

/* --------------------------- GLOBAL CSS --------------------------- */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
:root{
  --obsidian:${tokens.colors.obsidian}; --ivory:${tokens.colors.ivory}; --chalk:${tokens.colors.chalk};
  --gold:${tokens.colors.antiqueGold}; --text-strong:${tokens.colors.textStrong}; --text-body:${tokens.colors.textBody};
  --gold-hairline:${tokens.colors.goldHairline}; --ease:${tokens.easing};
  --nav-h: 56px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{scroll-behavior:smooth}
body{
  font-family:${tokens.fonts.body};
  color:var(--text-body);
  background:var(--ivory);
  overflow-x:hidden;
  opacity:0;
  animation:siteFade 0.8s ease forwards;
}
@keyframes siteFade{
  to{ opacity:1; }
}

/* NAVBAR */
.nav{
  position: fixed; top:0; left:0; width:100%;
  display:flex; align-items:center; justify-content:space-between;
  gap:16px; padding:18px 28px;
  min-height: var(--nav-h);
  background: rgba(247,243,238,0.85); /* ivory glass */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--gold-hairline);
  z-index: 1000;
  transition: background 0.4s ease;
}
.nav.scrolled{
  background: rgba(248,242,235,0.85);
}

/* three zones */
.nav-left, .nav-center, .nav-right{ flex:1; display:flex; align-items:center }
.nav-left{ justify-content:flex-start }
.nav-center{ justify-content:center }
.nav-right{ justify-content:flex-end; gap:18px }

/* brand center (desktop) */
.brand{
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  letter-spacing: 0.18em;
  color: var(--obsidian);
  text-decoration:none; cursor:pointer;
}
.brand:focus-visible{
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

/* links */
.nav a{
  color: var(--obsidian);
  text-decoration: none;
  font-weight: 500;
}

/* secure button look (like your screenshot) */
.nav-secure{
  border: 1px solid var(--gold);
  border-radius: 12px;
  padding: 8px 14px;
  background: transparent;
}
.nav-secure:hover{ background: var(--gold); color: var(--ivory) }

/* HAMBURGER (hidden desktop, visible mobile) */
.hamburger{
  display:none;
  border:1px solid var(--gold);
  background:transparent;
  border-radius:10px;
  padding:6px 10px;
  font-size:18px;
  cursor:pointer;
}

/* Fullscreen overlay above navbar; blocks clicks by covering page */
.nav-menu{
  position: fixed; inset: 0;
  display: none; z-index: 3000;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(2px);
}
.nav-menu.open{ display: block; }

/* Card */
.menu-card{
  width: min(520px, 92vw);
  margin: 18vh auto 0;
  background: var(--ivory);
  border: 1px solid var(--gold-hairline);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0,0,0,.28);
  padding: 18px 18px 22px;
}
.menu-head{ display:flex; align-items:center; justify-content:space-between; padding:4px 4px 10px }
.menu-label{ font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); font-weight:600 }
.menu-close{ border:none; background:transparent; cursor:pointer; font-size:20px; color:var(--obsidian) }
.menu-list{ display:flex; flex-direction:column; gap:18px; align-items:center; padding:10px 6px 6px }
.menu-list a{ text-decoration:none; color:var(--obsidian); font-family:'Playfair Display', serif; font-size:20px }

/* Show Contact on desktop, hide on mobile (hamburger covers mobile) */
.nav-contact{ display:inline-block; }

/* Mobile */
@media (max-width:700px){
  .nav-contact{ display:none; }   /* hide on mobile */
  .nav{ padding:12px 14px }
  .nav-left{ display:none }
  .nav-center{ justify-content:flex-start }
  .brand{ font-size:20px }
  .nav-right{ gap:10px; flex-wrap:nowrap }
  .nav-right a{ font-size:14px }
  .nav-secure{ padding:6px 10px; border-radius:10px }
  .hamburger{ display:inline-block }
  .menu-card{ width:min(420px,92vw) }
  .menu-list a{ font-size:18px }
}

/* SECTIONS */
section{padding:160px 80px;border-bottom:1px solid var(--gold-hairline)}
h2.section-title{font-family:${tokens.fonts.headline};font-size:42px;text-align:center;margin-bottom:48px;color:var(--obsidian)}

/* HERO - Hero section with background video */
.hero{position:relative;width:100%;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;opacity:0.9;filter:brightness(1.1) contrast(1.05);animation:fadeInVideo 2s ease-in forwards}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.35));z-index:1}
.hero-text{position:relative;z-index:2;text-align:center;color:rgba(255,255,255,0.9);text-shadow:0 2px 12px rgba(0,0,0,0.35);max-width:700px;padding:0 20px}

@keyframes fadeInVideo{
  from{opacity:0}
  to{opacity:1}
}
.hero-text h1{font-family:${tokens.fonts.headline};font-size:54px;line-height:1.1;margin-bottom:16px}
.hero-text p{font-size:18px;margin-bottom:32px}
.cta{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--gold);padding-bottom:4px;transition:color .3s var(--ease)}
.cta:hover{color:var(--ivory)}
.hero-secure {
  display: inline-block;
  font-size: 17px;
  color: #d7c4a3;
  text-decoration: none;
  border-bottom: 1px solid rgba(215,196,163,0.4);
  padding-bottom: 2px;
  margin-right: 16px;
  transition: color 0.3s ease, border-color 0.3s ease;
}
.hero-secure:hover {
  color: #fff;
  border-color: rgba(255,255,255,0.6);
}

@media (max-width:600px){
  .hero-text h1{font-size:36px}
}

/* STATEMENT */
#statement{text-align:center;background:var(--chalk)}
#statement p{max-width:780px;margin:0 auto;font-size:18px;line-height:1.7;color:var(--text-strong)}

/* PHASES */
#phases{background:var(--ivory)}
.phase{display:flex;align-items:center;justify-content:space-between;gap:48px;margin-bottom:120px}
.phase img{width:55%;border-radius:16px;filter:grayscale(1) contrast(1.1) brightness(0.95)}
.phase .text{width:45%}
.phase h3{font-family:${tokens.fonts.headline};font-size:28px;margin-bottom:12px}
.phase p{margin-bottom:16px}
.more-info{color:var(--gold);text-decoration:none;font-weight:500}

/* 90-Day Bundle section styling */
.bundle-offer{
  text-align:center;
  padding:80px 0 60px;
  background:var(--chalk);
  color:var(--text-body);
  border-top:1px solid rgba(0,0,0,0.05);
  border-bottom:1px solid rgba(0,0,0,0.05);
}
.bundle-offer h3{
  font-family:'Playfair Display',serif;
  font-size:26px;
  font-weight:600;
  margin-bottom:8px;
}
.bundle-offer p{
  font-size:15px;
  color:rgba(0,0,0,0.7);
  margin-bottom:20px;
}
.secure-access-btn{
  border:1px solid var(--gold);
  background:transparent;
  color:var(--text-body);
  padding:10px 18px;
  border-radius:10px;
  cursor:pointer;
  transition:background 0.3s ease;
  font-family:inherit;
  font-size:15px;
}
.secure-access-btn:hover{
  background:var(--gold);
  color:var(--chalk);
}

/* Trust note below secure access buttons */
.trust-note{
  font-size:12px;
  color:rgba(11,11,11,0.55);
  text-align:center;
  margin-top:8px;
}

/* PROCESS */
#process{background:var(--chalk)}
.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.step{padding:24px;border:1px solid var(--gold-hairline);border-radius:12px;background:#fff}
.step h4{font-family:${tokens.fonts.headline};margin-bottom:8px;color:var(--obsidian)}

/* INVESTMENT */
#bundle{text-align:center;background:var(--chalk);padding:120px 24px}
#bundle h2{font-family:${tokens.fonts.headline};font-size:36px;color:var(--obsidian)}
#bundle .summary{margin-top:12px;color:var(--text-strong)}
#bundle .btn,.btn{margin-top:32px;background:transparent;border:1px solid var(--gold);padding:14px 32px;color:var(--obsidian);font-family:${tokens.fonts.body};border-radius:8px;cursor:pointer;transition:all .3s var(--ease);display:inline-block;text-decoration:none}
#bundle .btn:hover,.btn:hover{background:var(--gold);color:var(--ivory)}

/* PREMIUM TOOLKITS */
#toolkits{background:var(--ivory);padding:120px 80px;border-bottom:1px solid var(--gold-hairline)}
.toolkit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;margin-top:48px}
.toolkit{background:var(--chalk);border:1px solid var(--gold-hairline);border-radius:16px;padding:28px 24px;transition:transform 0.3s var(--ease)}
.toolkit:hover{transform:translateY(-4px)}
.phase-tag{display:block;font-size:12px;color:var(--gold);margin-bottom:8px;letter-spacing:0.5px}
.toolkit h4{font-family:'Playfair Display',serif;font-size:20px;margin-bottom:6px;color:var(--obsidian)}
.toolkit p{font-size:15px;color:var(--text-body);line-height:1.5}
.toolkit .format{margin-top:4px;font-size:13px;color:rgba(11,11,11,0.55)}
.toolkit-cta{text-align:center;margin-top:48px}
.proof{text-align:center;margin-top:32px;font-size:14px;color:rgba(11,11,11,0.7);font-style:italic}

/* QUOTE SECTIONS — elegant, real quote styling */
.maxim-section{
  background: var(--ivory);
  padding: 80px 80px;
  border-top: 1px solid var(--gold-hairline);
}
.maxim-card{
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  background: radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 60%), var(--chalk);
  border: 1px solid var(--gold-hairline);
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
}
.maxim-quote{
  position: relative;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 26px;
  line-height: 1.7;
  color: var(--obsidian);
  max-width: 720px;
  margin: 0 auto;
}
/* decorative quotes */
.maxim-quote::before,
.maxim-quote::after{
  position: absolute;
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  line-height: 0;
  color: rgba(191,167,107,0.55); /* antique gold, subtle */
  pointer-events: none;
}
.maxim-quote::before{
  content: """;
  left: -28px; top: -4px;
}
.maxim-quote::after{
  content: """;
  right: -28px; bottom: -10px;
}
@media (max-width: 900px){
  .maxim-section{ padding: 64px 24px; }
  .maxim-quote{ font-size: 22px; }
  .maxim-quote::before{ left: -18px; }
  .maxim-quote::after{ right: -18px; }
}

/* FAQ — clean, minimal, elegant */
.faq{ background:var(--ivory); padding:120px 80px; }
.faq .section-title{
  font-family:'Playfair Display',serif;
  font-size:40px; text-align:center; color:var(--obsidian);
  margin-bottom:60px;
}

/* Accordion items */
.faq-item{
  border-top:1px solid var(--gold-hairline);
  padding:22px 0;
}
.faq-item:last-of-type{ border-bottom:1px solid var(--gold-hairline); }

.faq-item summary{
  font-family:'Inter',sans-serif;
  font-size:18px; font-weight:500;
  color:var(--obsidian);
  cursor:pointer;
  list-style:none;
  position:relative;
  transition:color .25s var(--ease);
}
.faq-item summary::-webkit-details-marker{ display:none; }
.faq-item summary::after{
  content:"+";
  position:absolute; right:0; font-size:20px; color:var(--gold);
  transition:transform .25s var(--ease);
}
.faq-item[open] summary::after{ transform:rotate(45deg); }

.faq-item p{
  margin:14px 0 0;
  color:var(--text-body);
  line-height:1.6;
  font-size:16px;
  max-width:900px;
}

@media(max-width:700px){
  .faq{ padding:80px 24px; }
  .faq .section-title{ font-size:32px; }
  .faq-item summary{ font-size:17px; }
  .faq-item p{ font-size:15px; }
}

/* LEGAL PAGES + HELP */
.help{font-size:14px;opacity:.8}
.legal{max-width:900px;margin:0 auto;line-height:1.75;color:var(--text-strong)}
.legal ol{padding-left:18px}
.legal li{margin:8px 0}

/* CONTACT PAGE */
.contact-wrap{max-width:900px;margin:0 auto}
.card{background:var(--chalk);border:1px solid var(--gold-hairline);border-radius:16px;padding:24px;margin-bottom:28px}
.card h3{font-family:'Playfair Display',serif;color:var(--obsidian);margin-bottom:6px}
.help{font-size:14px;opacity:.85;margin-bottom:14px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.input,.textarea,.select,.checkbox{
  width:100%;padding:12px 14px;border:1px solid var(--gold-hairline);border-radius:10px;background:#fff;color:var(--obsidian);font:inherit
}
.textarea{min-height:140px;resize:vertical}
.checkbox{width:auto}
.form-row{margin-top:12px}
.actions{margin-top:16px;display:flex;gap:12px}
@media (max-width: 800px){.form-grid{grid-template-columns:1fr}}

/* GLOBAL MODAL STYLING — Unified Elegant Look */
.modal{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  display:none;
  justify-content:center;
  align-items:center;
  z-index:3000;
  background:rgba(11,11,11,0.55); /* soft dark overlay */
  backdrop-filter:blur(6px);
}

.modal > div,
.modal .panel,
.modal-content{
  background:var(--chalk); /* unified elegant tone */
  border-radius:18px;
  max-width:720px;
  padding:48px 40px;
  color:var(--text-body);
  box-shadow:0 8px 32px rgba(0,0,0,0.25);
  overflow-y:auto;
  max-height:85vh;
  animation:fadeInModal 0.5s var(--ease);
}

/* Scroll-friendly inside modals */
.modal .panel::-webkit-scrollbar,
.modal-content::-webkit-scrollbar{
  width:6px;
}
.modal .panel::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb{
  background-color:rgba(191,167,107,0.4);
  border-radius:3px;
}

.modal .panel h3{font-family:${tokens.fonts.headline};margin-bottom:12px;color:var(--obsidian)}
.modal .panel ul{padding-left:16px}
.modal .panel li{margin:8px 0}
.modal .close{margin-top:16px;display:inline-block;cursor:pointer;color:var(--gold)}

/* Optional fade animation */
@keyframes fadeInModal{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}

/* PROGRAM MODAL TITLE — clean, prominent */
.program-title{
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  line-height: 1.2;
  color: var(--obsidian);
  letter-spacing: .2px;
  margin-bottom: 14px;
  text-align: left;
  position: relative;
}
.program-title::after{
  content:"";
  display:block;
  width:72px;
  height:2px;
  background: var(--gold);
  margin-top:10px;
  opacity:.7;
  border-radius:1px;
}
@media (max-width: 600px){
  .program-title{ font-size: 26px; }
}

/* SECURE ACCESS SHEET — half height, slide up */
.sheet{
  position:fixed; inset:0; display:flex; align-items:flex-end;
  background:rgba(0,0,0,.45); z-index:2500;
  opacity:0; pointer-events:none; transition:opacity .25s var(--ease);
}
.sheet.open{ opacity:1; pointer-events:auto; }

.sheet .panel{
  position:relative; width:100%; height:50vh; max-height:640px; background:#fff;
  border-top-left-radius:16px; border-top-right-radius:16px; border:1px solid var(--gold-hairline);
  padding:24px 24px 32px; box-shadow:0 -20px 60px rgba(0,0,0,.25);
  transform:translateY(100%); transition:transform .35s var(--ease);
  overflow:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain;
}
.sheet.open .panel{ transform:translateY(0); }

.sheet .handle{ width:48px; height:4px; background:#E5E5E5; border-radius:999px; margin:8px auto 16px; }

/* Accessibility: respect reduced motion */
@media (prefers-reduced-motion: reduce){
  .sheet{ transition:none; }
  .sheet .panel{ transition:none; transform:none; }
}

/* FOOTER */
footer{background:var(--obsidian);color:var(--ivory);text-align:center;padding:64px 24px;font-size:14px;border-top:1px solid var(--gold-hairline)}
footer a{color:var(--ivory);text-decoration:underline;opacity:.9}
footer a:hover{opacity:1}

/* RESPONSIVE */
@media (max-width:1200px){section{padding:140px 60px}.process-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:900px){
  .phase{flex-direction:column} .phase img,.phase .text{width:100%}
}
@media (max-width:700px){
  .phase.refine{display:flex;flex-direction:column}
  .phase.refine img{order:1}
  .phase.refine .text{order:2}
  #toolkits{padding:96px 24px}
}
@media (max-width:600px){section{padding:96px 20px}.process-grid{grid-template-columns:1fr}}

/* PROGRAM MODAL — What's Included block */
.program-included h4{
  font-family:'Playfair Display', serif;
  font-size:24px;
  color:var(--obsidian);
  margin:0 0 12px 0;
}
.program-included ul{
  list-style:none;
  padding-left:0;
  margin:0;
}
.program-included li{
  display:flex;
  gap:10px;
  align-items:flex-start;
  margin:8px 0;
  color:var(--text-body);
}
.program-included li::before{
  content:"•";
  font-size:18px;
  line-height:1;
  color:var(--gold);
  opacity:.85;
  margin-top:2px;
}

/* Result line + tagline */
.program-result{
  margin-top:20px;
  font-size:20px;
  color:var(--obsidian);
}
.program-result .lead{
  font-weight:600;
  letter-spacing:.3px;
}
.program-tagline{
  margin-top:14px;
  font-family:'Playfair Display', serif;
  font-style:italic;
  color:var(--obsidian);
  opacity:.9;
}

@media (max-width:600px){
  .program-included h4{ font-size:20px; }
  .program-result{ font-size:18px; }
}

/* Sticky Buy Bar */
.buy-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--ivory);
  border-top: 1px solid var(--gold-hairline);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: var(--obsidian);
  padding: 10px 14px;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.6s ease;
  z-index: 2000; /* above content, below modal */
}

/* When visible */
.buy-bar.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Button style */
.buy-bar .buy-btn {
  color: var(--gold);
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}
.buy-bar .buy-btn:hover {
  text-decoration: none;
  opacity: 0.8;
}

/* MOBILE */
@media (max-width: 700px) {
  .buy-bar {
    font-size: 14px;
    padding: 8px 10px;
    flex-wrap: wrap;
    text-align: center;
  }
}

/* CHECKOUT PAGE */
.checkout-page {
  background: #f8f2eb;
  min-height: 100vh;
  padding: 60px 24px;
  text-align: center;
  color: #171717;
}
.subhead {
  max-width: 600px;
  margin: 0 auto 24px;
  font-size: 16px;
}
.trust-line {
  margin-top: 12px;
  font-size: 14px;
  color: #333;
}
.cta {
  margin-top: 20px;
  background: #171717;
  color: #f8f2eb;
  border: none;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.micro-proof {
  font-size: 13px;
  margin-top: 16px;
  font-style: italic;
}
.fallback {
  font-size: 13px;
  margin-top: 8px;
}
.fallback a {
  color: #8c7040;
  text-decoration: underline;
}
.toggle {
  background: none;
  border: none;
  color: #8c7040;
  cursor: pointer;
  margin-top: 20px;
}
.details {
  list-style: none;
  padding: 0;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.6;
}
`;

/* ----------------------- CHECKOUT PAGE ----------------------- */
export function CheckoutPage() {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <main className="checkout-page">
      <h1>Secure checkout</h1>
      <p className="subhead">
        Instant access to the 90-Day Elegant Lifestyle. After payment, you'll be redirected
        to your Welcome page with step-by-step instructions.
      </p>

      <WhopCheckoutEmbed
        fallback={<>Loading checkout...</>}
        planId="plan_JNpVughNh9qVj"
        theme="light"
        hidePrice={false}
      />

      <p className="trust-line">
        🔒 Encrypted payments with major cards, Apple Pay, and Google Pay. 3D Secure enabled.
      </p>

      <button className="cta">Confirm access</button>

      <p className="micro-proof">
        "By week four I dressed on autopilot and spoke without second-guessing." — First name, city
      </p>

      <p className="fallback">
        Having trouble?{" "}
        <a
          href="https://whop.com/checkout/plan_JNpVughNh9qVj"
          target="_blank"
        >
          Use the alternate checkout
        </a>
      </p>

      <button
        className="toggle"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Hide what's included ▲" : "What's included ▼"}
      </button>

      {showDetails && (
        <ul className="details">
          <li>Private portal with guided daily rituals</li>
          <li>REBUILD foundation toolkit</li>
          <li>REFINE style planner and Velvet Voice scripts</li>
          <li>RADIATE progress tracker</li>
          <li>Aesthera women's circle access</li>
        </ul>
      )}
    </main>
  );
}

/* ----------------------- ROUTER (hash only) ----------------------- */
type Route =
  | { page: "home"; section?: string }
  | { page: "contact" }
  | { page: "checkout" }
  | { page: "terms" }
  | { page: "privacy" };

function parseHash(): Route {
  let h = window.location.hash.replace(/^#/, "");
  if (h.startsWith("/")) h = h.slice(1);
  if (h === "" || h === "/") return { page: "home" };
  const key = h.toLowerCase();
  if (key === "contact") return { page: "contact" };
  if (key === "checkout") return { page: "checkout" };
  if (key === "terms") return { page: "terms" };
  if (key === "privacy") return { page: "privacy" };
  // anything else means Home with a target section (e.g. "phases")
  return { page: "home", section: key };
}

/* ----------------------- SMALL UI PRIMITIVES ---------------------- */
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; }> = ({ open, onClose, children }) => (
  <div className="modal" role="dialog" aria-modal="true" style={{ display: open ? "flex" : "none" }}
       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="panel" tabIndex={0}>{children}<span className="close" onClick={onClose}>Close</span></div>
  </div>
);

const Sheet: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; }> = ({ open, onClose, children }) => (
  <div className={`sheet ${open ? "open" : ""}`} onClick={(e)=>{ if (e.target === e.currentTarget) onClose(); }}>
    <div className="panel" tabIndex={0}>
      <div className="handle" />
      <span className="close" onClick={onClose} style={{ position:"absolute", right:20, top:14, cursor:"pointer", color:"var(--gold)" }}>Close</span>
      {children}
    </div>
  </div>
);



/* ------------------------------ PAGES ------------------------------ */
const HomePage: React.FC<{ onOpen: (k:"rebuild"|"refine"|"radiate")=>void; initialSection?: string; setProgramOpen: (v:boolean)=>void; setSecureOpen: (v:boolean)=>void; }> = ({ onOpen, initialSection, setProgramOpen, setSecureOpen }) => {
  // scroll to requested section
  useEffect(() => {
    if (!initialSection) return;
    const el = document.getElementById(initialSection);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
  }, [initialSection]);

  return (
    <>
      <section id="hero" className="hero">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1674221525704-f4b2aa13df2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsZXQlMjBkYW5jZXIlMjBlbGVnYW50fGVufDF8fHx8MTc2MjMwMzY5OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Ballerina placeholder"
          className="hero-video"
        />
        <video
          className="hero-video"
          src="/ballerina.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>

        <div className="hero-overlay"></div>

        <div className="hero-text">
          <h1>Discipline Made Visible</h1>
          <p>
            In 90 days, your identity, style, and voice align to create effortless
            magnetism.
          </p>
          <a
            href="#"
            className="hero-secure"
            onClick={(e)=>{e.preventDefault(); setSecureOpen(true);}}
          >
            Enter The 90-Day Elegant Lifestyle →
          </a>
          <br />
          <a href="#" className="more-info" onClick={(e)=>{ e.preventDefault(); setProgramOpen(true); }}>
            More info →
          </a>
        </div>
      </section>

      <section id="statement" className="fade-in"><p>Imagine waking up 90 days from now — calm, radiant, and composed. Your mornings begin with rhythm instead of rush. Your posture, wardrobe, and voice align effortlessly with the woman you've become.</p></section>

      <section id="phases" aria-label="Three Phases of Transformation" className="fade-in">
        <h2 className="section-title">Three Phases of Becoming Her</h2>
        <div className="phase fade-in">
          <img src={rebuildImg} alt="Rebuild Phase" />
          <div className="text">
            <h3>1–30 Days — Rebuild</h3>
            <p>Reset your foundation with clarity, rituals, and self-respect.</p>
            <a href="#" className="more-info" onClick={(e)=>{e.preventDefault();onOpen("rebuild");}}>More Info →</a>
          </div>
        </div>
        <div className="phase refine fade-in">
          <div className="text">
            <h3>31–60 Days — Refine</h3>
            <p>Define your signature aesthetic and master visual presence.</p>
            <a href="#" className="more-info" onClick={(e)=>{e.preventDefault();onOpen("refine");}}>More Info →</a>
          </div>
          <img src={refineImg} alt="Refine Phase" />
        </div>
        <div className="phase fade-in">
          <img src={radiateImg} alt="Radiate Phase" />
          <div className="text">
            <h3>61–90 Days — Radiate</h3>
            <p>Command attention through authentic, composed presence.</p>
            <a href="#" className="more-info" onClick={(e)=>{e.preventDefault();onOpen("radiate");}}>More Info →</a>
          </div>
        </div>
      </section>

      {/* 90-Day Bundle — positioned between Radiate and Premium Toolkits */}
      <section className="bundle-offer fade-in">
        <h3>90-Day Bundle — €119</h3>
        <p>Edition of 777 • Lifetime access</p>
        <button
          className="secure-access-btn"
          onClick={(e) => {
            e.preventDefault();
            setSecureOpen(true);
          }}
        >
          Secure access →
        </button>
        <p className="trust-note">
          Secure checkout via Whop · Instant digital access · Edition of 777 only
        </p>
      </section>

      {/* PREMIUM TOOLKITS SECTION */}
      <section id="toolkits" className="fade-in">
        <h2 className="section-title">Premium Toolkits</h2>

        <div className="toolkit-grid">
          {/* REBUILD */}
          <div className="toolkit">
            <span className="phase-tag">REBUILD · Unlocks Day 1</span>
            <h4>Sovereign Compass Audit</h4>
            <p>Clarify 3 personal standards and 2 boundaries you'll run daily. Use on Day 1 to set your rules of engagement.</p>
            <p className="format">Format · 15-minute guided worksheet</p>
          </div>

          <div className="toolkit">
            <span className="phase-tag">REBUILD · Instant Access</span>
            <h4>Foundation Toolkit</h4>
            <p>Turn mornings into a system with a 10-minute ritual and streak tracker so you never "start over."</p>
            <p className="format">Format · Ritual guide + printable tracker</p>
          </div>

          {/* REFINE */}
          <div className="toolkit">
            <span className="phase-tag">REFINE · Week 2</span>
            <h4>Signature Style Planner</h4>
            <p>Build a repeatable capsule wardrobe in one afternoon and map a 10-outfit grid to remove decision fatigue.</p>
            <p className="format">Format · Step-by-step planner + look grid</p>
          </div>

          <div className="toolkit">
            <span className="phase-tag">REFINE · Day 15</span>
            <h4>Velvet Voice Scripts</h4>
            <p>Speak with composed presence using 12 everyday scripts and the 5-minute pre-room routine.</p>
            <p className="format">Format · Script cards + audio walkthroughs</p>
          </div>

          <div className="toolkit">
            <span className="phase-tag">REFINE · Instant Access</span>
            <h4>Communication Toolkit</h4>
            <p>Master tone, cadence, and boundaries in DMs, meetings, and dates with plug-and-play prompts.</p>
            <p className="format">Format · Templates + quick-reference sheet</p>
          </div>

          {/* RADIATE */}
          <div className="toolkit">
            <span className="phase-tag">RADIATE · Week 8</span>
            <h4>Reflection & Metrics Tracker</h4>
            <p>Track wins in 3 minutes a day with Never Miss Twice and weekly calibration cards.</p>
            <p className="format">Format · Mobile-friendly tracker + weekly review</p>
          </div>
        </div>

        <div className="toolkit-cta">
          <a
            href="#"
            className="cta"
            onClick={(e) => {
              e.preventDefault();
              setSecureOpen(true);
            }}
          >
            Unlock your toolkits →
          </a>
        </div>

        <p className="proof">Real women, real results. "The Signature Style Planner made getting dressed effortless by week two." — Amira, Rotterdam</p>
      </section>

      <section id="process" aria-label="Method" className="fade-in">
        <h2 className="section-title">The Method</h2>
        <div className="process-grid">
          <div className="step"><h4>01 — Choose</h4><p>Select The 90-Day Elegant Lifestyle.</p></div>
          <div className="step"><h4>02 — Secure Checkout</h4><p>Safe, seamless payment processing via Whop.</p></div>
          <div className="step"><h4>03 — Portal Access</h4><p>Instant access to your transformation materials.</p></div>
          <div className="step"><h4>04 — Daily Rituals</h4><p>Begin your journey with guided daily practices.</p></div>
        </div>
      </section>

      <section id="bundle" aria-label="Investment" className="fade-in">
        <h2>90-Day Bundle — €119</h2>
        <p className="summary">Edition of 777 • Lifetime access</p>
        <a className="btn" href="#"
           onClick={(e)=>{ e.preventDefault(); setSecureOpen(true); }}>
          Secure access →
        </a>
      </section>

      {/* Quote 1 */}
      <section id="maxim-elegance" className="maxim-section fade-in" aria-label="Elegance maxim">
        <div className="maxim-card">
          <p className="maxim-quote">"Elegance begins when confidence becomes quiet."</p>
        </div>
      </section>

      {/* Quote 2 */}
      <section id="maxim-refinement" className="maxim-section fade-in" aria-label="Refinement maxim">
        <div className="maxim-card">
          <p className="maxim-quote">"Refinement is the art of knowing what to remove."</p>
        </div>
      </section>

      {/* Program Offer — after Method, before FAQ */}
      <section id="program-offer" aria-label="Program Offer" className="fade-in" style={{ textAlign: "center" }}>
        <h2 className="section-title">The 90-day Elegant Lifestyle — $119</h2>
        <p className="summary">Edition of 777 • Lifetime access</p>
        <p style={{ maxWidth: 720, margin: "12px auto 20px" }}>
          Includes access to our private Aesthera women's circle — connect, share progress, and grow together.
        </p>
        <a
          className="btn"
          href="#"
          onClick={(e)=>{ e.preventDefault(); setSecureOpen(true); }}
        >
          Secure access →
        </a>
        <p className="trust-note">
          Secure checkout via Whop · Instant digital access · Edition of 777 only
        </p>
      </section>

      <section id="faq" className="faq fade-in">
        <h2 className="section-title">Frequently Asked Questions</h2>

        <details className="faq-item">
          <summary>What is Aesthera?</summary>
          <p>
            Aesthera is more than a brand — it's a philosophy of self-evolution. It's the home of the 90-Day Elegant Lifestyle, a three-phase journey designed to help you rebuild your foundation, refine your presence, and radiate effortless confidence. Every element is crafted to bring your identity, style, and voice into harmony — so you don't just look elegant, you live it.
          </p>
        </details>

        <details className="faq-item">
          <summary>What exactly is included in this bundle?</summary>
          <p>
            You get all three phases — Rebuild, Refine, and Radiate — structured across 90 days. Each phase includes worksheets, templates, and rituals designed to transform your identity, style, and presence.
          </p>
        </details>

        <details className="faq-item">
          <summary>Can I do the phases in a different order?</summary>
          <p>
            We recommend following the sequence — Rebuild → Refine → Radiate — because each phase builds on the previous. However, you have lifetime access, so you can revisit phases or move at your own pace.
          </p>
        </details>

        <details className="faq-item">
          <summary>I don't have time for a full program. Will this fit my schedule?</summary>
          <p>
            Yes. The Elegant Lifestyle uses micro habits, environmental cues, and weekly rhythm templates. You'll work in focused 15–30 minute blocks. The goal isn't to do more — it's to live with rhythm, structure, and calm momentum.
          </p>
        </details>

        <details className="faq-item">
          <summary>I've tried therapy and confidence courses. How is this different?</summary>
          <p>
            Those focus on insight. This builds embodiment. Calm, Style, Communication, and Boundaries are trained together with scripts, trackers, and rituals. It's identity work that shows up in behavior — visible, measurable, lasting.
          </p>
        </details>

        <details className="faq-item">
          <summary>What if I struggle to stay consistent?</summary>
          <p>
            The Sovereignty Audit, quick-win rituals, and weekly metrics keep progress visible. You'll see growth in numbers and reflection templates. Identity-based motivation replaces willpower — so the new version of you becomes automatic.
          </p>
        </details>
      </section>
    </>
  );
};

const ContactPage: React.FC = () => {
  const TO = "A3sthera@proton.me";

  const openMailto = (subject: string, body: string) => {
    const url = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const topic = String(fd.get("topic") || "General question");
    const message = String(fd.get("message") || "");

    const subject = `Contact form — ${topic} — ${name}`;
    const body =
`Name: ${name}
Email: ${email}
Topic: ${topic}

Message:
${message}

— Sent from AESTHERA Contact`;
    openMailto(subject, body);
  };

  const submitPR = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const company = String(fd.get("company") || "");
    const link = String(fd.get("link") || "");
    const timeline = String(fd.get("timeline") || "");
    const message = String(fd.get("message") || "");

    const subject = `Partnerships & Press — ${company || "Proposal"} — ${name}`;
    const body =
`Name: ${name}
Email: ${email}
Company/Organization: ${company}
Proposal / Media Kit: ${link}
Expected Timeline: ${timeline}

Message:
${message}

— Sent from AESTHERA Partnerships & Press`;
    openMailto(subject, body);
  };

  return (
    <section style={{ paddingTop: 120 }}>
      <div className="contact-wrap">
        {/* Simple Contact */}
        <div className="card">
          <h2 className="section-title" style={{ textAlign: "left", marginBottom: 8 }}>Contact us</h2>
          <p className="help">Most questions are answered in the FAQ and inside your portal. If you still need help, send us a message.</p>
          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              <div>
                <label htmlFor="name">Your Name</label>
                <input id="name" name="name" className="input" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" className="input" type="email" placeholder="you@email.com" required />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="topic">Topic</label>
              <select id="topic" name="topic" className="select" defaultValue="General question">
                <option>General question</option>
                <option>Access issue</option>
                <option>Billing</option>
                <option>Refund</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" className="textarea" placeholder="How can we help?" required />
            </div>

            <div className="form-row" style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input id="agree" type="checkbox" className="checkbox" required />
              <label htmlFor="agree" className="help">I agree to the <a href="#/privacy">privacy policy</a>.</label>
            </div>

            <div className="actions">
              <button type="submit" className="btn">Send message</button>
              <a className="btn" href="mailto:A3sthera@proton.me?subject=Support%20Request">Email instead</a>
            </div>
          </form>
        </div>

        {/* Partnerships & Press */}
        <div className="card">
          <h2 className="section-title" style={{ textAlign: "left", marginBottom: 8 }}>Partnerships &amp; Press</h2>
          <p className="help">We say yes to aligned values, quality production, and audience fit.</p>
          <form onSubmit={submitPR} noValidate>
            <div className="form-grid">
              <div>
                <label htmlFor="pr-name">Your Name</label>
                <input id="pr-name" name="name" className="input" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="pr-email">Email</label>
                <input id="pr-email" name="email" className="input" type="email" placeholder="you@email.com" required />
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label htmlFor="pr-company">Company/Organization</label>
                <input id="pr-company" name="company" className="input" placeholder="Your company or organization" />
              </div>
              <div>
                <label htmlFor="pr-link">Link to Proposal / Media Kit</label>
                <input id="pr-link" name="link" className="input" type="url" placeholder="https://…" />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="pr-eta">Expected Timeline</label>
              <input id="pr-eta" name="timeline" className="input" placeholder="e.g., Q1 2025" />
            </div>

            <div className="form-row">
              <label htmlFor="pr-message">Message</label>
              <textarea id="pr-message" name="message" className="textarea" placeholder="Tell us about your proposal…" required />
            </div>

            <div className="form-row" style={{ display:"flex", alignItems:"center", gap:8 }}>
              <input id="pr-agree" type="checkbox" className="checkbox" required />
              <label htmlFor="pr-agree" className="help">I agree to the <a href="#/privacy">privacy policy</a>.</label>
            </div>

            <div className="actions">
              <button type="submit" className="btn">Send inquiry</button>
              <a className="btn" href="mailto:A3sthera@proton.me?subject=Partnership%20or%20Press">Email instead</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const TermsPage: React.FC = () => (
  <section style={{ paddingTop: 120 }}>
    <h2 className="section-title">Terms of Service</h2>
    <div className="legal">
      <p><em>Last updated: November 2, 2025</em></p>
      <ol>
        <li>
          <strong>1. Parties &amp; Scope</strong>
          <p>These Terms govern the agreement between you ("User") and Aesthera, registered in the Netherlands, for the use of this website and any digital products offered.</p>
        </li>
        <li>
          <strong>2. Services</strong>
          <p>Aesthera provides the 90-Day Elegant Lifestyle digital program, consisting of three phases: Rebuild, Refine, and Radiate.</p>
        </li>
        <li>
          <strong>3. Agreement Formation</strong>
          <p>Your purchase or enrolment constitutes acceptance of these Terms. They take effect upon checkout completion.</p>
        </li>
        <li>
          <strong>4. Access &amp; Use</strong>
          <p>Lifetime access may be granted to materials subject to these Terms. Redistribution or resale is prohibited.</p>
        </li>
        <li>
          <strong>5. Payment &amp; Pricing</strong>
          <p>All prices are displayed in US dollars. Payment is processed via Whop, our secure checkout partner.</p>
        </li>
        <li>
          <strong>6. Refunds &amp; Cancellations</strong>
          <p>Dutch consumer law applies. For digital products, the 14-day right of withdrawal ends once you gain access to the digital material.</p>
        </li>
        <li>
          <strong>7. Intellectual Property</strong>
          <p>All content, branding, and frameworks are the property of Aesthera. Personal use only.</p>
        </li>
        <li>
          <strong>8. Liability</strong>
          <p>Aesthera's liability is limited to direct damages up to the fee paid, unless caused by wilful misconduct or gross negligence.</p>
        </li>
        <li>
          <strong>9. Law &amp; Jurisdiction</strong>
          <p>These Terms are governed by Dutch law. Disputes are submitted to the courts of the Netherlands.</p>
        </li>
        <li>
          <strong>10. Contact</strong>
          <p>Aesthera<br/>E-mail: <a href="mailto:A3sthera@proton.me">A3sthera@proton.me</a></p>
        </li>
      </ol>
    </div>
  </section>
);

const PrivacyPage: React.FC = () => (
  <section style={{ paddingTop: 120 }}>
    <h2 className="section-title">Privacy Policy</h2>
    <div className="legal">
      <p><em>Last updated: November 2, 2025</em></p>
      <ol>
        <li>
          <strong>1. Controller</strong>
          <p>Aesthera, registered in the Netherlands, is responsible for processing your personal data.</p>
        </li>
        <li>
          <strong>2. Data We Collect</strong>
          <ul>
            <li>Name, e-mail, billing address (to process purchases)</li>
            <li>Usage data (IP, device, site behavior)</li>
            <li>Optional newsletter preferences</li>
          </ul>
        </li>
        <li>
          <strong>3. Purpose &amp; Legal Basis</strong>
          <ul>
            <li>To process your order (contract basis)</li>
            <li>To send updates (with your consent)</li>
            <li>To analyze site use (legitimate interest)</li>
          </ul>
        </li>
        <li>
          <strong>4. Retention</strong>
          <p>We keep your data as long as necessary for tax or service reasons. Billing data: 7 years (per Dutch law).</p>
        </li>
        <li>
          <strong>5. Sharing</strong>
          <p>We share data with Whop for payment processing and analytics providers under EU-compliant agreements.</p>
        </li>
        <li>
          <strong>6. Rights</strong>
          <p>You may request access, correction, deletion, restriction, or portability of your data at any time by contacting <a href="mailto:A3sthera@proton.me">A3sthera@proton.me</a>.</p>
        </li>
        <li>
          <strong>7. Cookies</strong>
          <p>We use essential cookies. Analytics or marketing cookies only with your consent.</p>
        </li>
        <li>
          <strong>8. Security</strong>
          <p>We use encryption and access controls to protect your data.</p>
        </li>
        <li>
          <strong>9. Complaints</strong>
          <p>If you believe your data rights are violated, you may contact the Autoriteit Persoonsgegevens (Dutch Data Protection Authority).</p>
        </li>
        <li>
          <strong>10. Contact</strong>
          <p>Aesthera<br/>E-mail: <a href="mailto:A3sthera@proton.me">A3sthera@proton.me</a></p>
        </li>
      </ol>
    </div>
  </section>
);

/* ------------------------------- APP ------------------------------- */
export default function App() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<null | "rebuild" | "refine" | "radiate" | "program">(null);
  const [programOpen, setProgramOpen] = useState(false);
  const [secureOpen, setSecureOpen] = useState(false);
  const [route, setRoute] = useState<Route>(parseHash());
  const [showBuyBar, setShowBuyBar] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [menuOpen]);

  useEffect(() => {
    const nav = document.querySelector('.nav');
    const onScroll = () => {
      if (window.scrollY > 60) nav?.classList.add('scrolled');
      else nav?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setShowBuyBar(scrollPercent > 5); // changed from 25% → 5%
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FIXED ELEGANT SCROLL ANIMATIONS — works after navigation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 } // triggers when 15% of element is visible
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    // clean up and re-attach when navigating
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  });

  // SCROLL TO TOP ON NAVIGATION
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#/")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const homeSection = route.page === "home" ? route.section : undefined;

  // modal content
  const modalContent = useMemo(() => {
    if (modal === "rebuild") return (
      <>
        <h3>Rebuild — More Info</h3>
        <ul>
          <li><strong>Mindset Mastery</strong> — Build confidence through clarity and daily rituals.</li>
          <li><strong>Self-Care Rituals</strong> — Nurture body, mind, and spirit with elegant discipline.</li>
          <li><strong>Value Clarity</strong> — Identify your authentic identity and core values.</li>
        </ul>
      </>
    );
    if (modal === "refine") return (
      <>
        <h3>Refine — More Info</h3>
        <ul>
          <li><strong>Master the fundamentals of aesthetic alignment —</strong> Build a signature style that reflects your authentic identity.</li>
          <li><strong>Visual Presence —</strong> Curate your aesthetic across wardrobe, social presence, and environment.</li>
          <li><strong>Refinement Rituals —</strong> Daily practices that make elegance effortless.</li>
        </ul>
      </>
    );
    if (modal === "radiate") return (
      <>
        <h3>Radiate — More Info</h3>
        <ul>
          <li><strong>Voice & Expression</strong> — Speak with authority and grace.</li>
          <li><strong>Energy Mastery</strong> — Command calm confidence and unshakeable presence.</li>
          <li><strong>Magnetic Connection</strong> — Build genuine connections through authentic self-expression.</li>
        </ul>
      </>
    );
    if (modal === "program") {
      return (
        <>
          <h3 className="program-title">The 90-Day Elegant Lifestyle</h3>

          <p>
            Imagine waking up 90 days from now — calm, radiant, and composed.<br />
            Your mornings begin with rhythm, not rush.<br />
            Your posture, wardrobe, and voice move in quiet harmony with the woman you've become.<br />
            This isn't coincidence — it's design.
          </p>

          <p>
            The <strong>90-Day Elegant Lifestyle</strong> is a guided three-phase journey that refines how you think, move, and express yourself until elegance becomes effortless.
          </p>

          <h4>Days 1–30 — Rebuild</h4>
          <p>
            Clear emotional noise and restore your foundation. Through Shadow Alchemy, boundary rituals, and reflective templates, you'll build self-trust and stability — the ground for graceful living.
          </p>

          <h4>Days 31–60 — Refine</h4>
          <p>
            Define your aesthetic and elevate your presence. With the Signature Style Capsule and Velvet Voice frameworks, you'll align your visual, verbal, and energetic expression into one authentic whole.
          </p>

          <h4>Days 61–90 — Radiate</h4>
          <p>
            Integrate everything until composure feels natural. Posture, breathwork, and magnetic connection training help you embody quiet confidence that commands respect without effort.
          </p>

          <p>
            Each phase takes only <strong>20–40 minutes per day</strong>, blending emotional regulation, identity design, and ritualized rhythm into visible, lasting transformation.
          </p>

          <p><em>This isn't self-improvement — it's identity refinement through rhythm, beauty, and discipline.</em></p>

          <h4>What's Included</h4>
          <ul>
            <li>Three-Phase Roadmap — Rebuild · Refine · Radiate</li>
            <li>Shadow Alchemy & Emotional Regulation Toolkit</li>
            <li>Signature Style Capsule (PEARL Framework)</li>
            <li>The Velvet Voice — Scripts & Tonality Mastery</li>
            <li>High-Value Boundaries System</li>
            <li>Magnetism Without Chasing Presence Training</li>
            <li>Weekly Sovereign Scorecard & Printable Worksheets</li>
          </ul>

          <p>
            <strong>Result:</strong> calm focus, timeless style, and magnetic confidence that doesn't chase — it attracts.<br />
            <strong>Discipline made visible. Elegance made effortless.</strong>
          </p>
        </>
      );
    }
    return null;
  }, [modal]);

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-left">
          <a href="#/">Home</a>
        </div>

        <div className="nav-center">
          <a className="brand" href="#/">AESTHERA</a>
        </div>

        <div className="nav-right">
          {/* Desktop-only Contact link */}
          <a href="#/contact" className="nav-contact">Contact us</a>

          {/* Secure button (opens sheet) */}
          <a
            href="#"
            className="nav-secure"
            onClick={(e)=>{ e.preventDefault(); setSecureOpen(true); }}
          >
            Secure access →
          </a>

          {/* Hamburger (far right) */}
          <button
            className="hamburger"
            aria-label="Open menu"
            aria-controls="nav-menu"
            aria-expanded={menuOpen}
            onClick={()=>setMenuOpen(v=>!v)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Centered NAV menu (overlay) */}
      <div
        className={`nav-menu ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        onClick={(e)=>{ if (e.target === e.currentTarget) setMenuOpen(false); }}
      >
        <div className="menu-card" tabIndex={0}>
          <div className="menu-head">
            <span className="menu-label">NAVIGATION</span>
            <button className="menu-close" aria-label="Close menu" onClick={()=>setMenuOpen(false)}>×</button>
          </div>

          <nav className="menu-list">
            <a href="#/" onClick={()=>setMenuOpen(false)}>Home</a>
            <a href="#/contact" onClick={()=>setMenuOpen(false)}>Contact us</a>
          </nav>
        </div>
      </div>

      {/* ROUTES */}
      {route.page === "home" && <HomePage onOpen={setModal} initialSection={homeSection} setProgramOpen={setProgramOpen} setSecureOpen={setSecureOpen} />}
      {route.page === "contact" && <ContactPage />}
      {route.page === "checkout" && <CheckoutPage />}
      {route.page === "terms" && <TermsPage />}
      {route.page === "privacy" && <PrivacyPage />}

      {/* FOOTER (on all pages) */}
      <footer className="fade-in">
        <p>© 2025 AESTHERA · <a href="#/privacy">Privacy</a> · <a href="#/terms">Terms</a></p>
      </footer>

      {/* MORE INFO MODALS (only content; visible on Home) */}
      <Modal open={modal!==null} onClose={()=>setModal(null)}>{modalContent}</Modal>

      <Modal open={programOpen} onClose={()=>setProgramOpen(false)}>
        <h3>The 90-Day Elegant Lifestyle</h3>

        <p>
          Imagine waking up 90 days from now — calm, radiant, and composed.<br />
          Your mornings begin with rhythm, not rush.<br />
          Your posture, wardrobe, and voice move in quiet harmony with the woman you've become.<br />
          This isn't coincidence — it's design.
        </p>

        <p>
          The <strong>90-Day Elegant Lifestyle</strong> is a guided three-phase journey that refines how you think, move, and express yourself until elegance becomes effortless.
        </p>

        <h4>Days 1–30 — Rebuild</h4>
        <p>
          Clear emotional noise and restore your foundation. Through Shadow Alchemy, boundary rituals, and reflective templates, you'll build self-trust and stability — the ground for graceful living.
        </p>

        <h4>Days 31–60 — Refine</h4>
        <p>
          Define your aesthetic and elevate your presence. With the Signature Style Capsule and Velvet Voice frameworks, you'll align your visual, verbal, and energetic expression into one authentic whole.
        </p>

        <h4>Days 61–90 — Radiate</h4>
        <p>
          Integrate everything until composure feels natural. Posture, breathwork, and magnetic connection training help you embody quiet confidence that commands respect without effort.
        </p>

        <p>
          Each phase takes only <strong>20–40 minutes per day</strong>, blending emotional regulation, identity design, and ritualized rhythm into visible, lasting transformation.
        </p>

        <p><em>This isn't self-improvement — it's identity refinement through rhythm, beauty, and discipline.</em></p>

        <h4>What's Included</h4>
        <ul>
          <li>Three-Phase Roadmap — Rebuild · Refine · Radiate</li>
          <li>Shadow Alchemy & Emotional Regulation Toolkit</li>
          <li>Signature Style Capsule (PEARL Framework)</li>
          <li>The Velvet Voice — Scripts & Tonality Mastery</li>
          <li>High-Value Boundaries System</li>
          <li>Magnetism Without Chasing Presence Training</li>
          <li>Weekly Sovereign Scorecard & Printable Worksheets</li>
        </ul>

        <p>
          <strong>Result:</strong> calm focus, timeless style, and magnetic confidence that doesn't chase — it attracts.<br />
          <strong>Discipline made visible. Elegance made effortless.</strong>
        </p>
      </Modal>

      <Sheet open={secureOpen} onClose={()=>setSecureOpen(false)}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 className="section-title" style={{ marginTop: 0 }}>Secure access →</h2>

          <p style={{ fontWeight: 600, color: "var(--obsidian)" }}>Your Selection</p>
          <h3 style={{ fontFamily: tokens.fonts.headline, margin: "8px 0 4px", color: "var(--obsidian)" }}>
            The 90-Day Elegant Lifestyle
          </h3>
          <p className="summary">€119 · Edition of 777 · Lifetime Access</p>

          <a className="btn" href="#/checkout"
             onClick={()=>setSecureOpen(false)}>
            Enter The 90-Day Elegant Lifestyle →
          </a>
        </div>
      </Sheet>

      {/* Sticky buy bar — fades in on scroll */}
      <div className={`buy-bar ${showBuyBar ? "visible" : ""}`}>
        <span className="buy-title">The 90-Day Elegant Lifestyle</span>
        <span className="buy-price">— $119</span>
        <a
          href="#"
          className="buy-btn"
          onClick={(e) => {
            e.preventDefault();
            setSecureOpen(true);
          }}
        >
          Secure access →
        </a>
      </div>
    </>
  );
}
