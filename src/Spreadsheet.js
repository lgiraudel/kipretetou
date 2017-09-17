import GoogleSpreadsheet from 'google-spreadsheet';
import creds from './key/kipretetou-d59c0ea82272.json';

const retrieveSheet = new Promise((resolve, reject) => {
  const spreadsheetId = '1Eq_RsW9X9loO3zQEg-uuaT70YR4-6SRBAcf5nDtf2kg';
  const doc = new GoogleSpreadsheet(spreadsheetId);

  doc.useServiceAccountAuth(creds, () => {
    doc.getInfo(function(err, info) {
      resolve(info.worksheets[0]);
    });
  });
})

export default retrieveSheet;