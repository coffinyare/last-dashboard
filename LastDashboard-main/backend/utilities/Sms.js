import axios from 'axios';

// Utility to send SMS
export const sendSms = async (recipient, content) => {
  try {
    // Validate input
    if (!recipient || !content) {
      throw new Error('Recipient and content are required.');
    }

    const response = await axios.get('https://tabaarakict.so/SendSMS.aspx', {
      params: {
        user: 'Bile2024',
        pass: 'Bile@2024@',
        rec: recipient,
        cont: content,
      },
    });

    return response.data; // Return response data
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw new Error('Failed to send SMS: ' + error.message);
  }
};
