export const appendOrderToSheet = async (
  spreadsheetId: string,
  accessToken: string,
  rowData: any[]
): Promise<boolean> => {
  try {
    const range = 'Sheet1!A1'; // Standard range for appending
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
    
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    });

    if (!response.ok) {
      console.warn('Failed to write to Sheet1!A1. Trying fallback sheet range...');
      // Fallback: append directly to whatever first tab is there without specifying Sheet name
      const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`;
      const fallbackResponse = await fetch(fallbackUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData],
        }),
      });
      return fallbackResponse.ok;
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error appending order to Google sheet:', error);
    return false;
  }
};

// Check spreadsheet info to verify connection
export const verifySpreadsheetAccess = async (
  spreadsheetId: string,
  accessToken: string
): Promise<boolean> => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating spreadsheet access:', error);
    return false;
  }
};
