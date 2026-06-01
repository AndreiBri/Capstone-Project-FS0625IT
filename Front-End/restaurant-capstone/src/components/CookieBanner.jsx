import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const COOKIE_KEY = "monkey_cookie_consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({ necessary: true, analytics: false, marketing: false });

  const saveConsent = (prefs) => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        ...prefs,
        necessary: true,
        timestamp: new Date().toISOString(),
      }),
    );

    window.dispatchEvent(new Event("cookieConsentUpdated"));

    setVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);

    if (!saved) {
      const timeOut = setTimeout(() => {
        setVisible(true);
      }, 800);
      return () => clearTimeout(timeOut);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-[#320842] border border-[#DABFFF]/20 rounded-3xl shadow-2xl shadow-[#A06CD5]/20 overflow-hidden">
        {/* Banner principale */}
        {!showDetails ? (
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Testo */}
              <div className="flex-1">
                <h3 className="font-black text-[#DABFFF] tracking-tight mb-2">Utilizziamo i cookie</h3>
                <p className="text-[#DABFFF]/60 text-sm leading-relaxed">
                  Questo sito usa cookie tecnici necessari al funzionamento e, previo consenso, cookie analitici e di marketing. Puoi accettare tutti i cookie,
                  rifiutarli o personalizzare le tue preferenze.{" "}
                  <Link to="/cookie" className="text-[#A06CD5] hover:text-[#DABFFF] underline underline-offset-2 transition-colors">
                    Cookie Policy
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacy" className="text-[#A06CD5] hover:text-[#DABFFF] underline underline-offset-2 transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* Bottoni */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-xs font-black px-4 py-2.5 rounded-xl border border-[#DABFFF]/20 text-[#DABFFF]/60 hover:border-[#DABFFF]/40 hover:text-[#DABFFF] transition-all duration-200"
                >
                  Personalizza
                </button>
                <button
                  onClick={handleRejectAll}
                  className="text-xs font-black px-4 py-2.5 rounded-xl border border-[#DABFFF]/20 text-[#DABFFF]/60 hover:border-[#DABFFF]/40 hover:text-[#DABFFF] transition-all duration-200"
                >
                  Rifiuta tutti
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="text-xs font-black px-5 py-2.5 rounded-xl bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white transition-all duration-200 shadow-lg shadow-[#A06CD5]/30"
                >
                  Accetta tutti
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Pannello dettagli */
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-[#DABFFF] tracking-tight">Preferenze cookie</h3>
              <button onClick={() => setShowDetails(false)} className="text-[#DABFFF]/40 hover:text-[#DABFFF] transition-colors text-sm">
                ← Indietro
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Necessari */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#DABFFF]/10 bg-[#1a0526]/40">
                <div className="flex-1">
                  <div className="font-black text-[#DABFFF] text-sm mb-1">Cookie necessari</div>
                  <p className="text-[#DABFFF]/50 text-xs leading-relaxed">
                    Indispensabili per il funzionamento del sito. Includono autenticazione e preferenze di sessione. Non possono essere disabilitati.
                  </p>
                </div>
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-6 rounded-full bg-[#A06CD5] relative cursor-not-allowed opacity-60">
                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analitici */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#DABFFF]/10 bg-[#1a0526]/40">
                <div className="flex-1">
                  <div className="font-black text-[#DABFFF] text-sm mb-1">Cookie analitici</div>
                  <p className="text-[#DABFFF]/50 text-xs leading-relaxed">
                    Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo informazioni in forma anonima.
                  </p>
                </div>
                <button onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))} className="shrink-0 mt-1">
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${preferences.analytics ? "bg-[#A06CD5]" : "bg-[#DABFFF]/20"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${preferences.analytics ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#DABFFF]/10 bg-[#1a0526]/40">
                <div className="flex-1">
                  <div className="font-black text-[#DABFFF] text-sm mb-1">Cookie di marketing</div>
                  <p className="text-[#DABFFF]/50 text-xs leading-relaxed">
                    Utilizzati per mostrare pubblicità pertinente e misurare l'efficacia delle campagne promozionali.
                  </p>
                </div>
                <button onClick={() => setPreferences((p) => ({ ...p, marketing: !p.marketing }))} className="shrink-0 mt-1">
                  <div
                    className={`w-10 h-6 rounded-full relative transition-colors duration-200 ${preferences.marketing ? "bg-[#A06CD5]" : "bg-[#DABFFF]/20"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${preferences.marketing ? "translate-x-5" : "translate-x-1"}`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Bottoni */}
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={handleRejectAll}
                className="text-xs font-black px-4 py-2.5 rounded-xl border border-[#DABFFF]/20 text-[#DABFFF]/60 hover:border-[#DABFFF]/40 hover:text-[#DABFFF] transition-all duration-200"
              >
                Rifiuta tutti
              </button>
              <button
                onClick={handleSavePreferences}
                className="text-xs font-black px-5 py-2.5 rounded-xl bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white transition-all duration-200 shadow-lg shadow-[#A06CD5]/30"
              >
                Salva preferenze
              </button>
              <button
                onClick={handleAcceptAll}
                className="text-xs font-black px-5 py-2.5 rounded-xl bg-[#DABFFF] text-[#320842] hover:bg-white transition-all duration-200 shadow-lg"
              >
                Accetta tutti
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;
