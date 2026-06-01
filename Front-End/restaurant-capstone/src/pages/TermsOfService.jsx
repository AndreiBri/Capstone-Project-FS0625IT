const TermsOfService = () => {
  return (
    <main className="min-h-screen bg-[#1C0127] text-[#DABFFF]/90 px-6 py-16 md:py-24 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#DABFFF] mb-8 text-center">Termini di Servizio</h1>

        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-[#DABFFF]/80 mb-8">Ultimo aggiornamento: 01/06/2026</p>

          <p>
            I presenti Termini di Servizio regolano l'utilizzo del sito web di <strong>Monkey Family</strong>. Accedendo al sito, l'utente accetta i presenti
            termini.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-12 mb-4">1. Descrizione del servizio</h2>
          <p>
            Il sito web di Monkey Family consente agli utenti di visualizzare informazioni sui locali, consultare menu ed eventi, e effettuare prenotazioni
            tavoli online.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">2. Prenotazioni</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Le prenotazioni sono soggette a disponibilità.</li>
            <li>Monkey Family si riserva il diritto di annullare o modificare una prenotazione in caso di cause di forza maggiore.</li>
            <li>L'utente è pregato di comunicare eventuali cancellazioni con almeno 24 ore di anticipo.</li>
            <li>In caso di ritardo superiore a 15 minuti senza comunicazione, la prenotazione potrebbe essere annullata.</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">3. Contenuti del sito</h2>
          <p>
            Tutti i contenuti presenti sul sito (testi, immagini, loghi) sono di proprietà di Monkey Family e sono protetti dalle leggi sul diritto d'autore.
            È vietata la riproduzione senza autorizzazione scritta.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">4. Limitazione di responsabilità</h2>
          <p>
            Monkey Family non è responsabile per eventuali danni derivanti dall'utilizzo del sito o dall'impossibilità di accedervi. Le informazioni presenti
            sul sito (orari, menu, eventi) sono soggette a variazioni senza preavviso.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">5. Link esterni</h2>
          <p>
            Il sito può contenere link a siti di terze parti. Monkey Family non è responsabile per i contenuti o le pratiche privacy di tali siti.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">6. Legge applicabile</h2>
          <p>
            I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Bologna.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">7. Modifiche ai termini</h2>
          <p>
            Monkey Family si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche verranno pubblicate su questa pagina.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
