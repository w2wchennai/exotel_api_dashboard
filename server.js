const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const EXOTEL_SID = process.env.EXOTEL_SID;
const EXOTEL_TOKEN = process.env.EXOTEL_TOKEN;
const EXOPHONE = process.env.EXOPHONE;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/send-sms', async (req, res) => {
  const { to, message } = req.body;
  const params = new URLSearchParams();
  params.append('From', EXOPHONE);
  params.append('To', to);
  params.append('Body', message);

  const url = `https://api.exotel.com/v1/Accounts/${EXOTEL_SID}/Sms/send.json`;

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      body: params,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(EXOTEL_SID + ':' + EXOTEL_TOKEN).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const data = await apiRes.json();
    res.json({ message: data?.SMSMessage?.Status || 'Message sent or check response' });
  } catch (err) {
    res.json({ message: 'Failed to send SMS', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
