const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from React build

// --- DATA ---

const ALL_ROUTES = [
  { num: '12',   from: 'Howrah',       to: 'Babughat',      via: 'Strand Road',         type: 'city' },
  { num: '12A',  from: 'Howrah',       to: 'Esplanade',     via: 'Brabourne Road',      type: 'city' },
  { num: '12B',  from: 'Howrah',       to: 'Baghbazar',     via: 'Rabindra Sarani',     type: 'city' },
  { num: '30',   from: 'Tollygunge',   to: 'Esplanade',     via: 'Rashbehari Ave',      type: 'city' },
  { num: '30A',  from: 'Garia',        to: 'Esplanade',     via: 'EM Bypass',           type: 'city' },
  { num: '30B',  from: 'Garia',        to: 'Howrah',        via: 'Park Street',         type: 'city' },
  { num: '45',   from: 'Dharmatala',   to: 'Airport',       via: 'VIP Road',            type: 'city' },
  { num: '46A',  from: 'Santragachi',  to: 'Esplanade',     via: 'G.T. Road',           type: 'suburban' },
  { num: '78',   from: 'New Town',     to: 'Salt Lake',     via: 'Sector V',            type: 'city' },
  { num: '3B',   from: 'Noapara',      to: 'Howrah',        via: 'Belgharia',           type: 'suburban' },
  { num: 'C5',   from: 'Salt Lake',    to: 'Esplanade',     via: 'EM Bypass',           type: 'city' },
  { num: 'DN9',  from: 'Dum Dum',      to: 'Behala',        via: 'Park Circus',         type: 'city' },
  { num: '201',  from: 'Karunamoyee',  to: 'Esplanade',     via: 'Ultadanga',           type: 'city' },
  { num: '215',  from: 'Barasat',      to: 'Esplanade',     via: 'BT Road',             type: 'suburban' },
  { num: '220',  from: 'Barasat',      to: 'Howrah',        via: 'Dumdum',              type: 'suburban' },
  { num: '230',  from: 'Barrackpore',  to: 'Babughat',      via: 'BT Road',             type: 'suburban' },
  { num: 'AC1',  from: 'Howrah',       to: 'Dum Dum',       via: 'AJC Bose Road',       type: 'ac' },
  { num: 'AC2',  from: 'Garia',        to: 'Shyambazar',    via: 'E.M. Bypass',         type: 'ac' },
  { num: 'AC3',  from: 'Airport',      to: 'Esplanade',     via: 'VIP Road',            type: 'ac' },
  { num: 'AC9',  from: 'Salt Lake',    to: 'Howrah',        via: 'Park Street',         type: 'ac' },
  { num: 'S5',   from: 'Barasat',      to: 'Asansol',       via: 'NH-19',               type: 'district' },
  { num: 'S12',  from: 'Siliguri',     to: 'Jalpaiguri',    via: 'Sevoke Road',         type: 'district' },
  { num: 'S18',  from: 'Krishnanagar', to: 'Kolkata',       via: 'Kalyani Expressway',  type: 'district' },
  { num: 'S21',  from: 'Midnapore',    to: 'Kolkata',       via: 'NH-6',                type: 'district' },
  { num: 'S30',  from: 'Burdwan',      to: 'Kolkata',       via: 'NH-2',                type: 'district' },
  { num: 'S45',  from: 'Malda',        to: 'Kolkata',       via: 'NH-12',               type: 'district' },
  { num: '6',    from: 'Shyambazar',   to: 'Esplanade',     via: 'College Street',      type: 'city' },
  { num: '6A',   from: 'Shyambazar',   to: 'Tollygunge',    via: 'Park Street',         type: 'city' },
  { num: '6C',   from: 'Dum Dum Park', to: 'Babughat',      via: 'VIP Road',            type: 'city' },
  { num: '7C',   from: 'Jadavpur',     to: 'Shyambazar',    via: 'Rashbehari',          type: 'city' },
  { num: '8',    from: 'Tollygunge',   to: 'Dum Dum',       via: 'Rashbehari',          type: 'city' },
  { num: '10',   from: 'Behala',       to: 'Esplanade',     via: 'Diamond Harbour Rd',  type: 'city' },
  { num: '37',   from: 'Naktala',      to: 'Esplanade',     via: 'Jadavpur',            type: 'city' },
  { num: '37A',  from: 'Santoshpur',   to: 'Esplanade',     via: 'Gariahat',            type: 'city' },
  { num: '43A',  from: 'Garia',        to: 'Babughat',      via: 'Rashbehari',          type: 'city' },
  { num: '47A',  from: 'Khidirpur',    to: 'Ultadanga',     via: 'Park Street',         type: 'city' },
  { num: '222',  from: 'Madhyamgram',  to: 'Esplanade',     via: 'BT Road',             type: 'suburban' },
  { num: '230A', from: 'Titagarh',     to: 'Esplanade',     via: 'Shyambazar',          type: 'suburban' },
  { num: '234',  from: 'Sodepur',      to: 'Esplanade',     via: 'Shyambazar',          type: 'suburban' },
  { num: '236',  from: 'Bhatpara',     to: 'Esplanade',     via: 'BT Road',             type: 'suburban' },
  { num: 'AC-32',from: 'New Town',     to: 'Howrah',        via: 'Park Street',         type: 'ac' },
  { num: 'AC-48',from: 'Garia',        to: 'Airport',       via: 'EM Bypass',           type: 'ac' },
];

const TRAM_ROUTES = [
  { num: '1',  from: 'Esplanade',    to: 'Tollygunge',    via: 'Park Street',         freq: '~15 min' },
  { num: '2',  from: 'Esplanade',    to: 'Khidderpore',   via: 'Strand Road',         freq: '~20 min' },
  { num: '5',  from: 'Shyambazar',   to: 'Ballygunge',    via: 'College Street',      freq: '~25 min' },
  { num: '6',  from: 'Howrah Stn',   to: 'Esplanade',     via: 'Strand Road',         freq: '~20 min' },
  { num: '7',  from: 'Esplanade',    to: 'Gariahat',      via: 'Park Street',         freq: '~15 min' },
  { num: '11', from: 'Tollygunge',   to: 'Shyambazar',    via: 'Kalighat',            freq: '~30 min' },
  { num: '23', from: 'Belgachia',    to: 'Behala',        via: 'Sealdah',             freq: '~35 min' },
  { num: '25', from: 'Shyambazar',   to: 'Tollygunge',    via: 'Rashbehari',          freq: '~20 min' },
];

// --- API ENDPOINTS ---

// GET /api/routes?q=searchterm&type=category
app.get('/api/routes', (req, res) => {
  const { q, type } = req.query;
  let results = [...ALL_ROUTES];

  if (type && type !== 'all') {
    results = results.filter(r => r.type === type);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(r => 
      r.num.toLowerCase().includes(query) ||
      r.from.toLowerCase().includes(query) ||
      r.to.toLowerCase().includes(query) ||
      r.via.toLowerCase().includes(query)
    );
  }

  // Simulate slight network delay for more realistic feel
  setTimeout(() => {
    res.json(results);
  }, 300);
});

// GET /api/routes/:num
app.get('/api/routes/:num', (req, res) => {
  const num = req.params.num.toUpperCase();
  const route = ALL_ROUTES.find(r => r.num.toUpperCase() === num);
  
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  // Generate realistic-looking mock stops for the route
  const stops = [
    `${route.from} Bus Stand`,
    `${route.from} Checkpost`,
    `Towards ${route.via}`,
    `${route.via} Market`,
    `${route.via} Crossing`,
    `Approaching ${route.to}`,
    `${route.to} Terminus`
  ];

  setTimeout(() => {
    res.json({ ...route, stops });
  }, 300);
});

// GET /api/trams
app.get('/api/trams', (req, res) => {
  setTimeout(() => {
    res.json(TRAM_ROUTES);
  }, 300);
});

// Serve React app for any other route not handled by API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
