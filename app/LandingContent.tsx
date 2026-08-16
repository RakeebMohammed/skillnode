"use client";

import { motion } from "framer-motion";
import LeadForm from "./LeadForm";
import ThemeToggle from "./ThemeToggle";

const LOGO = "https://abccfruits.com/skillnode/assets/images/logo/logo.svg";

const PROBLEMS = [
  {
    title: "Hard to Find Trusted Local Services",
    body: "No single platform to discover verified local professionals and services in your area.",
  },
  {
    title: "Local Professionals Lack Visibility",
    body: "Talented freelancers and small businesses struggle to reach customers in their locality.",
  },
  {
    title: "No Hyperlocal-Focused Platform",
    body: "Global marketplaces overlook local nuances and trust factors that matter in Indian cities.",
  },
];

const STEPS = [
  { n: "1", title: "Choose Your Area", body: "Select your neighborhood or locality to find services nearby." },
  { n: "2", title: "Discover Verified Services", body: "Browse vetted local professionals with real reviews and ratings." },
  { n: "3", title: "Connect & Get Work Done", body: "Message, hire, and complete projects directly on the platform." },
];

const WHY_US = [
  { title: "Hyperlocal-First Approach", body: "We focus on neighborhoods, not cities. Know your service provider personally." },
  { title: "Built for Indian Cities", body: "Local languages, currencies, payment methods, and trust factors — built in from day one." },
  { title: "Simple Onboarding", body: "Whether customer, professional, or business — join in two minutes with just a phone number." },
  { title: "Transparent Communication", body: "Clear pricing, honest reviews, and direct communication with no middleman." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingContent({ email }: { email: string }) {
  return (
    <div className="skillnode-page">
      {/* NAV */}
      <header style={s.nav}>
        <div style={s.navInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="SkillNode" style={{ height: 28, width: "auto" }} />
          <nav style={s.navLinks}>
            <a href="#how-it-works" style={s.navLink}>How It Works</a>
            <a href="#why-us" style={s.navLink}>Why Us</a>
            <a href="#contact" style={s.navLink}>Contact Us</a>
          </nav>
          <div style={s.headerActions}>
            <ThemeToggle className="landing-theme-toggle" />
            <a href="#contact" style={s.ctaSmall}>Notify Me <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <motion.section
          style={s.hero}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <p style={s.eyebrow}>LAUNCHING SOON IN BANGALORE</p>
          <h1 style={s.h1}>India&apos;s First Hyperlocal Marketplace</h1>
          <p style={s.heroSub}>
            Local problems need local solutions. Find trusted services. Hire nearby talent.
          </p>
          <motion.a
            href="#contact"
            style={s.ctaButton}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Notify Me
          </motion.a>
        </motion.section>

        {/* PROBLEM */}
        <Reveal>
          <section style={s.section}>
            <p style={s.eyebrow}>WE UNDERSTAND YOUR PROBLEM</p>
            <h2 style={s.h2}>Why current platforms don&apos;t work for Indian local services</h2>
            <div style={s.cardGrid3}>
              {PROBLEMS.map((p, i) => (
                <RevealCard key={p.title} delay={i * 0.08}>
                  <h3 style={s.cardTitle}>{p.title}</h3>
                  <p style={s.cardBody}>{p.body}</p>
                </RevealCard>
              ))}
            </div>
            <p style={{ ...s.bodyText, marginTop: 24, fontWeight: 600 }}>SkillNode fixes this — locally.</p>
          </section>
        </Reveal>

        {/* HOW IT WORKS */}
        <Reveal>
          <section id="how-it-works" style={s.section}>
            <p style={s.eyebrow}>HOW IT WORKS</p>
            <h2 style={s.h2}>Three simple steps to connect locally</h2>
            <div style={s.cardGrid3}>
              {STEPS.map((step, i) => (
                <RevealCard key={step.title} delay={i * 0.08}>
                  <div style={s.stepNumber}>{step.n}</div>
                  <h3 style={s.cardTitle}>{step.title}</h3>
                  <p style={s.cardBody}>{step.body}</p>
                </RevealCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* WHY US */}
        <Reveal>
          <section id="why-us" style={s.section}>
            <p style={s.eyebrow}>WHY SKILLNODE?</p>
            <h2 style={s.h2}>Built differently for Indian cities</h2>
            <div style={s.cardGrid2}>
              {WHY_US.map((w, i) => (
                <RevealCard key={w.title} delay={i * 0.06}>
                  <h3 style={s.cardTitle}>{w.title}</h3>
                  <p style={s.cardBody}>{w.body}</p>
                </RevealCard>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CONTACT / FORM */}
        <Reveal>
          <section id="contact" style={{ ...s.section, ...s.formSection }}>
            <div style={s.contactGrid}>
              <div>
                <p style={s.eyebrow}>FREELANCER EARLY-BIRD QUESTIONNAIRE</p>
                <h2 style={{ ...s.h2, textAlign: "left" }}>Quick &amp; easy — takes less than a minute.</h2>
                <p style={{ ...s.bodyText, textAlign: "left", marginBottom: 0 }}>
                  Signed in as {email}. Tell us a bit about yourself and we&apos;ll notify you as soon as
                  SkillNode launches in your area.
                </p>
                <div style={{ marginTop: 32 }}>
                  <p style={{ fontSize: 13, opacity: 0.5, margin: "0 0 4px" }}>EMAIL</p>
                  <p style={{ margin: "0 0 16px" }}>hello@skillnode.in</p>
                  <p style={{ fontSize: 13, opacity: 0.5, margin: "0 0 4px" }}>LOCATION</p>
                  <p style={{ margin: 0 }}>Bangalore, India</p>
                </div>
              </div>
              <div style={s.formCard}>
                <LeadForm />
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="SkillNode" style={{ height: 24, width: "auto" }} />
          <p style={{ opacity: 0.5, fontSize: 13, marginTop: 12, maxWidth: 420 }}>
            A hyperlocal freelance marketplace built on trust, research, and innovation — connecting
            verified professionals and businesses in every neighborhood.
          </p>
          <p style={{ opacity: 0.4, fontSize: 12, marginTop: 20 }}>
            We collect approximate location (city-level, from IP address) for verified visitors, for
            security and to understand where early interest is coming from.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      style={s.card}
    >
      {children}
    </motion.div>
  );
}

const s: Record<string, React.CSSProperties> = {
  nav: { position: "sticky", top: 0, background: "var(--landing-nav)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--landing-border)", zIndex: 10 },
  navInner: { maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 },
  navLinks: { display: "flex", gap: 28, flex: 1, justifyContent: "center" },
  navLink: { fontSize: 14, opacity: 0.76, color: "var(--landing-text)", textDecoration: "none" },
  headerActions: { display: "flex", alignItems: "center", gap: 10 },
  ctaSmall: { background: "var(--landing-accent)", color: "#1d100a", padding: "10px 15px", borderRadius: 10, fontSize: 14, fontWeight: 750, textDecoration: "none", whiteSpace: "nowrap" },

  hero: { maxWidth: 760, margin: "0 auto", padding: "118px 24px 82px", textAlign: "center" },
  eyebrow: { color: "var(--landing-muted)", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14, textAlign: "center" },
  h1: { color: "var(--landing-text)", fontSize: "clamp(42px, 7vw, 68px)", lineHeight: 1.04, fontWeight: 800, letterSpacing: -2.3, margin: 0 },
  heroSub: { color: "var(--landing-subtle)", fontSize: 18, marginTop: 22, marginBottom: 36, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 },
  ctaButton: { display: "inline-block", background: "var(--landing-accent)", color: "#1d100a", padding: "15px 32px", borderRadius: 999, fontSize: 16, fontWeight: 750, textDecoration: "none", boxShadow: "0 12px 28px var(--landing-accent-shadow)" },

  section: { maxWidth: 1040, margin: "0 auto", padding: "80px 24px", borderTop: "1px solid var(--landing-border)" },
  h2: { color: "var(--landing-text)", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, letterSpacing: -1.2, margin: "0 0 40px", textAlign: "center", lineHeight: 1.15 },
  bodyText: { color: "var(--landing-subtle)", fontSize: 16, maxWidth: 520, margin: "0 auto 28px", textAlign: "center", lineHeight: 1.6 },

  cardGrid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 },
  cardGrid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  card: { background: "var(--landing-card)", border: "1px solid var(--landing-border)", borderRadius: 16, padding: 28, boxShadow: "var(--landing-card-shadow)" },
  cardTitle: { color: "var(--landing-text)", fontSize: 17, fontWeight: 700, margin: "0 0 10px" },
  cardBody: { color: "var(--landing-subtle)", fontSize: 14, margin: 0, lineHeight: 1.6 },
  stepNumber: { width: 32, height: 32, borderRadius: 999, background: "var(--landing-accent)", color: "#1d100a", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },

  formSection: { background: "var(--landing-panel)" },
  contactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" },
  formCard: { background: "var(--landing-card)", border: "1px solid var(--landing-border)", borderRadius: 20, padding: 32, boxShadow: "var(--landing-card-shadow)" },

  footer: { borderTop: "1px solid var(--landing-border)", padding: "56px 24px", textAlign: "center", color: "var(--landing-subtle)" },
  footerInner: { maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" },
};
