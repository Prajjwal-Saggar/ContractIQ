// src/pages/LandingPage.jsx
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-ink text-paper">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-steel/60 bg-ink/80 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <span className="font-molgan text-xl tracking-tight">Contract_IQ</span>
          <div className="hidden items-center gap-8 text-sm text-fog md:flex">
            <a href="#how-it-works" className="hover:text-paper transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-paper transition-colors">
              Features
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-fog hover:text-paper transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-md bg-evidence px-4 py-2 text-sm font-medium text-ink hover:bg-evidence/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <div>
          <h1 className="font-molgan text-4xl leading-tight md:text-5xl">
            Ask your contracts.
            <br />
            Get answers with proof.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-fog">
            Upload any legal contract and ask questions in plain language.
            Every answer traces back to the exact clause and page it came
            from — no guessing, no hallucinated legal language.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="rounded-md bg-evidence px-6 py-3 text-sm font-medium text-ink hover:bg-evidence/90 transition-colors"
            >
              Upload a contract
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-fog hover:text-paper transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Evidence mockup card — the hero visual */}
        <div className="rounded-lg border border-steel bg-slate p-6">
          <p className="mb-1 text-xs uppercase tracking-wide text-fog">
            employment_agreement.pdf
          </p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-fog">
            <p>
              12.2 Immediate Termination. The Company may terminate this
              Agreement immediately in the event of{" "}
              <span className="rounded bg-evidence/20 px-1 text-evidence">
                gross misconduct
              </span>
              , without prior notice or payment in lieu thereof.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-md border border-steel bg-steel/40 px-3 py-2">
            <span className="font-mono text-xs text-evidence">
              Section 12.2 · Page 8
            </span>
            <span className="flex items-center gap-1 text-xs text-verified">
              <span className="h-1.5 w-1.5 rounded-full bg-verified" />
              Verified
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-steel/60 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-molgan text-2xl md:text-3xl">How it works</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Upload",
                body: "Drop in a PDF contract. We extract the text page by page and identify its sections and clauses.",
              },
              {
                n: "02",
                title: "Ask",
                body: "Ask questions the way you'd ask a colleague — no need to know clause numbers or legal terms.",
              },
              {
                n: "03",
                title: "Verify",
                body: "Every answer comes with the exact section and page it's grounded in. Click through to read it yourself.",
              },
            ].map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-evidence">{step.n}</span>
                <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-steel/60 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-molgan text-2xl md:text-3xl">
            Built to answer from the contract, not around it
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-steel bg-slate p-6">
              <span className="h-2 w-2 rounded-full bg-evidence" />
              <h3 className="mt-4 text-base font-medium">
                Evidence-grounded answers
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                No vague "it depends on the terms." If the contract has an
                answer, you get it — clearly and directly.
              </p>
            </div>
            <div className="rounded-lg border border-steel bg-slate p-6">
              <span className="h-2 w-2 rounded-full bg-verified" />
              <h3 className="mt-4 text-base font-medium">
                Exact page citations
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Every claim links to a section and page. Click it, and the
                original PDF opens right there.
              </p>
            </div>
            <div className="rounded-lg border border-steel bg-slate p-6">
              <span className="h-2 w-2 rounded-full bg-flag" />
              <h3 className="mt-4 text-base font-medium">
                Risk detection
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fog">
                Automatically flags clauses worth a second look — unlimited
                liability, auto-renewal, broad non-competes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section  className="border-t border-steel/60 px-6 py-20 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-lg border border-steel bg-slate p-10 md:flex-row md:items-center">
          <div>
            <h2 className="font-molgan text-2xl">
              Upload your first contract
            </h2>
            <p className="mt-2 text-sm text-fog">
              Free to try. No credit card required.
            </p>
          </div>
          <Link
            to="/signup"
            className="rounded-md bg-evidence px-6 py-3 text-sm font-medium text-ink hover:bg-evidence/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-steel/60 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="font-molgan text-sm">Contract_IQ</span>
          <p className="max-w-xl text-xs leading-relaxed text-fog">
            Cited analyzes information in uploaded documents and does not
            provide legal advice. Consult a qualified legal professional for
            legal interpretation or decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;