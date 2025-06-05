global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'CARGADA' : 'VACÍA');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/ausencias', async (req, res) => {
  const { data, error } = await supabase.from('ausencias').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/ausencias', async (req, res) => {
  const { nombre, tipo, fecha_inicio, dias, email } = req.body;
  const { data, error } = await supabase.from('ausencias').insert([
    { nombre, tipo, fecha_inicio, dias, email }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
