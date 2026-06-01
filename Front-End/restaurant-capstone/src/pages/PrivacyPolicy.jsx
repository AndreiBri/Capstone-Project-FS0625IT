const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-[#1C0127] text-[#DABFFF]/90 px-6 py-16 md:py-24 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#DABFFF] mb-8 text-center">Informativa Privacy</h1>

        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-[#DABFFF]/80 mb-8">Ultimo aggiornamento: 01/06/2026</p>

          <p>
            La presente informativa descrive come <strong>Monkey Family</strong> raccoglie, utilizza e protegge i dati personali degli utenti che visitano il
            sito web, in conformità al Regolamento (UE) 2016/679 (GDPR).
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-12 mb-4">1. Titolare del trattamento</h2>
          <p>
            Monkey Family — Bologna, Italia.
            <br />
            Per qualsiasi richiesta relativa alla privacy: <strong>info@monkeyfamily.it</strong>
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">2. Dati raccolti</h2>
          <p>Il sito raccoglie i seguenti dati personali:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Dati di prenotazione</strong> — nome, cognome, email, numero di telefono, data e ora della prenotazione, numero di persone, eventuali note.
            </li>
            <li>
              <strong>Dati di autenticazione</strong> — email e password (cifrata) per gli account staff e supervisori.
            </li>
            <li>
              <strong>Dati di navigazione</strong> — informazioni tecniche raccolte automaticamente dal server (indirizzo IP, browser, pagine visitate).
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">3. Finalità del trattamento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestione delle prenotazioni tavoli</li>
            <li>Autenticazione e gestione degli account staff</li>
            <li>Invio di comunicazioni relative alla prenotazione</li>
            <li>Miglioramento del servizio e del sito web</li>
          </ul>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">4. Base giuridica</h2>
          <p>
            Il trattamento dei dati avviene sulla base del consenso dell'interessato (art. 6, par. 1, lett. a GDPR) e per l'esecuzione di un contratto o misure
            precontrattuali (art. 6, par. 1, lett. b GDPR).
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">5. Conservazione dei dati</h2>
          <p>
            I dati di prenotazione vengono conservati per il tempo necessario alla gestione del servizio e comunque non oltre 12 mesi dalla data della
            prenotazione. I dati degli account staff vengono conservati per tutta la durata del rapporto lavorativo.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">6. Diritti dell'interessato</h2>
          <p>L'utente ha diritto di:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accedere ai propri dati personali</li>
            <li>Richiedere la rettifica o la cancellazione</li>
            <li>Opporsi al trattamento</li>
            <li>Richiedere la portabilità dei dati</li>
            <li>Revocare il consenso in qualsiasi momento</li>
          </ul>
          <p className="mt-4">
            Per esercitare i propri diritti, scrivere a <strong>info@monkeyfamily.it</strong>.
          </p>

          <h2 className="text-3xl font-bold text-[#A06CD5] mt-10 mb-4">7. Modifiche all'informativa</h2>
          <p>
            Il titolare si riserva il diritto di modificare la presente informativa in qualsiasi momento. Le modifiche verranno pubblicate su questa pagina.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
