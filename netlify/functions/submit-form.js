// netlify/functions/submit-form.js

const { google } = require('googleapis');
const sheets = google.sheets('v4');

exports.handler = async (event) => {
    console.log('event:', event); // 이벤트 로그 확인

    // CORS 설정
    const headers = {
        'Access-Control-Allow-Origin': '*', // 모든 도메인 허용
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        // CORS preflight 요청에 대한 응답
        return {
            statusCode: 200,
            headers,
            body: 'CORS preflight response',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: 'Method Not Allowed',
        };
    }

    try {
        const formData = JSON.parse(event.body);
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheetsApi = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range = 'Sheet1!A1:E1';

        await sheetsApi.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [
                        formData.contestName,
                        formData.studentName,
                        formData.studentId,
                        formData.additionalInfo || '',
                        new Date().toLocaleString(),
                    ],
                ],
            },
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Data saved successfully!' }),
        };
    } catch (error) {
        console.error('Error saving data:', error);
        return {
            statusCode: 500,
            headers,
            body: 'Error saving data',
        };
    }
};