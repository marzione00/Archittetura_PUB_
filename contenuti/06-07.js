'use strict';
SL.catalogo.push({
  "id": "6.7",
  "title": "Protezione, cifratura e audit",
  "units": [
    {
      "id": "6.7.1",
      "title": "Autenticazione e autorizzazione sul fascicolo",
      "experiment": "Richiedi la modifica del fascicolo prima come studente, poi come docente e infine senza credenziali. Osserva la verifica dell’identità e l’applicazione dei diritti.",
      "skill": "Distinguere autenticazione e autorizzazione",
      "check": "L’assenza di credenziali ferma la richiesta prima della regola di ruolo. Con un’identità autenticata, l’esito dipende anche dall’operazione richiesta."
    },
    {
      "id": "6.7.2",
      "title": "Controlli sulle directory e sugli oggetti",
      "experiment": "Concedi la lettura su esiti e confronta «Solo elenco» con «Solo attraversamento» per /corso. Poi nega la lettura sul file, lasciando invariata la directory.",
      "skill": "Separare ricerca del nome e accesso al file",
      "check": "Il bit x sulla directory consente di cercare il nome noto. Il diritto di lettura sul file entra in gioco dopo che la ricerca ne ha raggiunto l’inode."
    },
    {
      "id": "6.7.3",
      "title": "Cifratura e posizione dell’avversario",
      "experiment": "Sposta l’osservatore dal disco rimosso all’interfaccia del volume sbloccato. Confronta una sessione autorizzata alla lettura con una a cui la lettura è negata.",
      "skill": "Definire il perimetro della cifratura a riposo",
      "check": "Il disco conserva blocchi cifrati. Nel volume sbloccato il sistema dispone della chiave, mentre i permessi determinano se l’account riceve i byte in chiaro."
    },
    {
      "id": "6.7.4",
      "title": "Evidenze di audit e loro interpretazione",
      "experiment": "Filtra il registro per account e oggetto. Sposta il minuto finale a ridosso di uno degli eventi e confronta righe selezionate, richieste concesse e richieste negate.",
      "skill": "Interpretare un registro di audit",
      "check": "Un evento entra nei conteggi solo se soddisfa tutti e tre i criteri. Un rifiuto documenta una richiesta respinta e va distinto da una modifica effettiva."
    },
    {
      "id": "6.7.5",
      "title": "Esercizi",
      "experiment": "Scegli «Comporre i diritti individuali e di gruppo». Annota le voci applicabili ad Ada nelle due tracce e verifica l’esito della richiesta di modifica.",
      "skill": "Verificare una decisione di accesso",
      "check": "Le stesse regole possono produrre esiti diversi a seconda dell’appartenenza al gruppo. La decisione deriva dai diritti effettivamente concessi sull’oggetto.",
      "kind": "esercizi"
    },
    {
      "id": "6.7.6",
      "title": "Soluzioni",
      "experiment": "Apri «Delimitare una conclusione di audit». Confronta i due filtri e verifica quali righe documentano un accesso concesso e a quale account è attribuito.",
      "skill": "Motivare la classificazione di un incidente",
      "check": "I record selezionati permettono di motivare i conteggi e l’attribuzione all’account. L’identità della persona che usava la sessione richiede un riscontro distinto.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez6_7_01_protection_goals",
      "title": "Obiettivi di protezione",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-a7d876f62e",
        "m6v-13218ec29b",
        "m6v-034bdc57e6",
        "m6v-a2557b7eda"
      ]
    },
    {
      "id": "cslez6_7_02_acl",
      "title": "Liste di controllo degli accessi",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-7240a621bd",
        "m6v-9c4cbd8981",
        "m6v-d01f6b5526",
        "m6v-f74739a76a"
      ]
    },
    {
      "id": "cslez6_7_03_directory_access",
      "title": "Accesso alle directory",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-fa87589a9c",
        "m6v-c7e94a5043",
        "m6v-d6f1395fd9",
        "m6v-e677c97ffb"
      ]
    },
    {
      "id": "cslez6_7_04_cryptofs",
      "title": "Cifratura del file system",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-0f837197c9",
        "m6v-44b60a79d6",
        "m6v-d206895a1d",
        "m6v-784c386a1d"
      ]
    },
    {
      "id": "cslez6_7_05_auditing",
      "title": "Verifica del registro degli accessi",
      "format": "scelta multipla / sequenza",
      "variants": [
        "m6v-46880000cc",
        "m6v-30d3bcc44b",
        "m6v-da13ff4385",
        "m6v-cd9a4cf5fb"
      ]
    }
  ]
});
