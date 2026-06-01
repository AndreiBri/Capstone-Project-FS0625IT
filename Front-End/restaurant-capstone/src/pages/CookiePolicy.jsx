const CookiePolicy = () => {
  return (
    <main className="min-h-screen bg-[#1C0127] text-[#DABFFF]/90 px-6 py-16 md:py-24 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#DABFFF] mb-8 text-center">Cookie Policy</h1>

        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-[#DABFFF]/80 mb-8">Ultimo aggiornamento: 01/06/2026</p>

          <p>
            La presente Cookie Policy descrive l'utilizzo dei cookie da parte del sito web di <strong>Monkey Family</strong> e spiega come vengono utilizzati
            per migliorare l'esperienza di navigazione degli utenti.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-12 mb-4">1. Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che i siti web inviano al dispositivo dell'utente durante la navigazione. Vengono memorizzati dal browser e
            ritrasmessi al sito durante le visite successive, permettendo di riconoscere il dispositivo e migliorare l'esperienza di navigazione.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">2. Tipologie di cookie utilizzati</h2>

          <h3 className="text-xl font-semibold mt-6">Cookie analitici</h3>
          <p>
            Cookie utilizzati per raccogliere informazioni statistiche anonime sull'utilizzo del sito, come il numero di visitatori e le pagine visualizzate.
            Aiutano a migliorare il funzionamento del sito e l'esperienza degli utenti.
          </p>

          <h3 className="text-xl font-semibold mt-6">Cookie di marketing / terze parti</h3>
          <p>Utilizzati da servizi esterni integrati nel sito. Il loro utilizzo è regolato dalle policy dei rispettivi fornitori.</p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">3. Servizi di terze parti</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google Maps (Google LLC)</strong> — visualizzazione mappe interattive per le sedi dei locali. Cookie: NID, CONSENT, 1P_JAR. Richiede
              consenso: SÌ.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#A06CD5] hover:text-[#DABFFF] underline">
                Privacy Policy Google
              </a>
            </li>
            <li>
              <strong>Cloudinary (Cloudinary Ltd)</strong> — gestione e upload immagini (solo utenti admin). Tipo: tecnico, necessario. Nessun cookie nel
              browser.
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">4. Gestione del consenso</h2>
          <p>
            Al primo accesso viene mostrato un banner che consente di accettare, rifiutare o personalizzare i cookie non necessari. È possibile modificare le
            preferenze in qualsiasi momento cliccando su <strong>"Gestisci cookie"</strong> nel footer del sito.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">5. Gestione tramite browser</h2>
          <p>
            È possibile gestire o disabilitare i cookie dalle impostazioni del proprio browser. La disabilitazione dei cookie tecnici potrebbe compromettere
            alcune funzionalità del sito.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Safari</li>
            <li>Microsoft Edge</li>
            <li>Opera</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">6. Modifiche alla Cookie Policy</h2>
          <p>
            Il titolare si riserva il diritto di modificare la presente Cookie Policy in qualsiasi momento. Le modifiche verranno pubblicate su questa pagina.
          </p>
        </div>
      </div>
    </main>
  );
};

export default CookiePolicy;
