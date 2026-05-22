const NABDA_URL = import.meta.env.VITE_NABDA_URL;
const NABDA_KEY = import.meta.env.VITE_NABDA_KEY;

export const NabdaService = {
  async sendOTP(phoneNumber: string) {
    try {
      // Normalize Iraqi phone numbers if needed
      let phone = phoneNumber.trim();
      if (phone.startsWith('0')) {
        phone = '964' + phone.substring(1);
      } else if (!phone.startsWith('964')) {
        phone = '964' + phone;
      }

      const response = await fetch(`${NABDA_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NABDA_KEY}`
        },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Nabda Send Error:', error);
      return { success: false, error: error.message };
    }
  },

  async verifyOTP(phoneNumber: string, code: string) {
    try {
      let phone = phoneNumber.trim();
      if (phone.startsWith('0')) {
        phone = '964' + phone.substring(1);
      } else if (!phone.startsWith('964')) {
        phone = '964' + phone;
      }

      const response = await fetch(`${NABDA_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NABDA_KEY}`
        },
        body: JSON.stringify({ phone, code })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Nabda Verify Error:', error);
      return { success: false, error: error.message };
    }
  }
};
