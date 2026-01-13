const express = require('express');
const app = express();
const communicate = require('./contact');
const atlas = require('./atlascontroller');
const auth = require('./usercontrol');
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const port = process.env.PORT || 2026;

(async () => {
  await communicate(); // DB connect

  app.use('/db', atlas);
  app.use('/auth', auth);

  app.listen(port, () => console.log(`Server running on port ${port}`));
})();
