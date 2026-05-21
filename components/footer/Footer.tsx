'use client';

import { useState, type FormEvent } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer className="bg-ink text-paper">
      <div className="px-6 md:px-10 pt-24 md:pt-32 pb-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7 reveal">
          <div className="eyebrow text-paper/60 mb-6">— Correspondence</div>
          <h3 className="display text-[10vw] md:text-[5vw] leading-[0.95]">
            Letters from
            <br />
            the <em className="display-italic">atelier</em>.
          </h3>
          <p className="mt-8 max-w-md text-paper/70 text-[15px] leading-relaxed">
            Six considered notes a year. Private previews. No marketing.
          </p>

          <form onSubmit={submit} className="mt-10 max-w-lg">
            <div className="flex items-center border-b border-paper/40 focus-within:border-paper transition-colors">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your address"
                className="flex-1 bg-transparent py-4 outline-none placeholder:text-paper/40 text-paper text-[17px]"
              />
              <button className="ui-label text-paper btn-line ml-4">Subscribe →</button>
            </div>
            {sent && (
              <div className="mt-4 display-italic text-paper/70">
                Thank you — your first letter arrives in September.
              </div>
            )}
          </form>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-8 md:gap-10 text-paper/80">
          <div>
            <div className="eyebrow text-paper/50 mb-5">NONGPALM</div>
            <ul className="space-y-3 text-[15px]">
              <li><a className="btn-line" href="#">Our Story</a></li>
              <li><a className="btn-line" href="#">The Atelier</a></li>
              <li><a className="btn-line" href="#">Sustainability</a></li>
              <li><a className="btn-line" href="#">Boutiques</a></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow text-paper/50 mb-5">Service</div>
            <ul className="space-y-3 text-[15px]">
              <li><a className="btn-line" href="#">Personal Shopping</a></li>
              <li><a className="btn-line" href="#">Repair &amp; Restoration</a></li>
              <li><a className="btn-line" href="#">Delivery</a></li>
              <li><a className="btn-line" href="#">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 border-t border-paper/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-paper/55 ui-label">
        <div>© MMXXVI — NONGPALM Harlowe · Firenze</div>
        <div className="flex items-center gap-8">
          <a className="btn-line" href="#">Instagram</a>
          <a className="btn-line" href="#">Journal</a>
          <a className="btn-line" href="#">Press</a>
        </div>
        <div>EN · EUR</div>
      </div>
    </footer>
  );
}
