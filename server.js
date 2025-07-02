const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let alarmHistory = [];
let currentSettings = { sensitivity: 2.5, isActive: false };

app.post('/api/alerts', (req, res) => {
  const alert = {
    message: req.body.message,
    timestamp: new Date(),
    device: req.body.deviceId || 'unknown'
  };
  
  alarmHistory.push(alert);
  console.log('Novo alerta:', alert);
  
  res.status(200).send('Alert received');
});

app.get('/api/alerts', (req, res) => {
  res.json(alarmHistory);
});

app.get('/api/settings', (req, res) => {
  res.json(currentSettings);
});

app.post('/api/settings', (req, res) => {
  currentSettings = { ...currentSettings, ...req.body };
  res.json(currentSettings);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});