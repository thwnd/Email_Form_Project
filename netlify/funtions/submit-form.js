const { google } = require('googleapis');
const sheets = google.sheets('v4');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const formData = JSON.parse(event.body);
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheetsApi = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = 'Sheet1!A1:E1';

        await sheetsApi.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    formData.contestName,
                    formData.studentName,
                    formData.studentId,
                    formData.additionalInfo,
                    new Date().toLocaleString()
                ]]
            }
        });

        return { statusCode: 200, body: JSON.stringify({ message: 'Data saved successfully!' }) };
    } catch (error) {
        console.error('Error saving data:', error);
        return { statusCode: 500, body: 'Error saving data' };
    }
};
