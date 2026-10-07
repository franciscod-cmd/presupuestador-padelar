/*
 * Configuración: en Apps Script > Project Settings > Script properties:
 * PADELAR_SPREADSHEET_ID = 1c7U7U2YCUXpawE2uOQ3fGF_eo-vy1eLQc1itqsTrPNY
 * Desplegar como Web App y pegar su URL en config.js.
 */
function doPost(event) {
  const record = JSON.parse(event.postData.contents);
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('PADELAR_SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Falta PADELAR_SPREADSHEET_ID en Script Properties.');
  const book = SpreadsheetApp.openById(spreadsheetId);
  const tabName = record.tabName;
  const sheet = book.getSheetByName(tabName) || book.insertSheet(tabName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Nombre', 'Localidad', 'Email', 'Teléfono celular']);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([record.contact.name, record.contact.city, record.contact.email, record.contact.phone]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, tabName })).setMimeType(ContentService.MimeType.JSON);
}
