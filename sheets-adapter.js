/*
 * Punto de extensión para una futura integración con Google Sheets.
 * Cuando se configure la autenticación, reemplazar el cuerpo de saveQuote
 * por una llamada a Google Sheets API o Apps Script. La UI ya le entrega
 * un objeto normalizado con todos los datos del presupuesto.
 */
const sheetsConfig = window.PADELAR_SHEETS_CONFIG || {};
const SHEET_ID = sheetsConfig.sheetId || '1c7U7U2YCUXpawE2uOQ3fGF_eo-vy1eLQc1itqsTrPNY';

function monthTab(date = new Date()) {
  return `Presupuestos ${new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date)}`;
}

window.PadelarSheetsAdapter = {
  spreadsheetId: SHEET_ID,
  toRecord(quote) {
    return {
      spreadsheetId: SHEET_ID,
      tabName: monthTab(),
      createdAt: new Date().toISOString(),
      contact: { name: quote.name, city: quote.city, email: quote.email, phone: quote.phone }
    };
  },
  async saveQuote(quote) {
    const record = this.toRecord(quote);
    // La URL proviene de un backend/Apps Script configurado por ambiente; nunca contiene secretos.
    if (!sheetsConfig.endpoint) {
      console.info('Google Sheets aún no configurado. Registro listo para enviar:', record);
      return { queued: false, configured: false, record };
    }
    const response = await fetch(sheetsConfig.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(record)
    });
    if (!response.ok) throw new Error('No fue posible registrar el presupuesto en Google Sheets.');
    return response.json();
  }
};
