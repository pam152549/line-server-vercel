import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const message = req.body.message || 'มีการแจ้งเตือนจาก ESP32!';
  const LINE_TOKEN = process.env.LINE_TOKEN;
  const USER_ID = process.env.USER_ID;

  if (!LINE_TOKEN || !USER_ID) {
    return res.status(500).send('Environment variables not set');
  }

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: USER_ID,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_TOKEN}`
        }
      }
    );
    res.status(200).send('ส่งข้อความสำเร็จ');
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).send('ส่งข้อความไม่สำเร็จ');
  }
}
