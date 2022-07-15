const express = require('express');
const app = express();
const videosRoutes = require('./routes/videos');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use('/videos', videosRoutes);

app
    .listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    })
