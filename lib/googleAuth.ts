import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets API setup
export async function getGoogleSheetsAuth() {
  try {
    // Use environment variables for sensitive credentials
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Create a JWT client using service account credentials
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Authorize the client
    await client.authorize();
    
    // Return the authorized Sheets client
    return google.sheets({ version: 'v4', auth: client });
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw new Error('Failed to authenticate with Google Sheets API');
  }
}

// Function to create a new Google Sheet or get an existing one
export async function getOrCreateSheet(title: string) {
  try {
    const auth = await getGoogleSheetsAuth();
    
    // If a spreadsheet ID is provided in environment variables, use that
    if (process.env.GOOGLE_SPREADSHEET_ID) {
      return {
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        sheets: auth,
      };
    }
    
    // Otherwise, create a new spreadsheet
    const response = await auth.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
      },
    });
    
    return {
      spreadsheetId: response.data.spreadsheetId,
      sheets: auth,
    };
  } catch (error) {
    console.error('Error creating/getting Google Sheet:', error);
    throw new Error('Failed to create or get Google Sheet');
  }
} 