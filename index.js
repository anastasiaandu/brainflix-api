const express = require('express');
const app = express();
const videosRoutes = require('./routes/videos');
const cors = require('cors');

app.use(express.json());

app.use(express.static('./public'))

app.use(cors());

app.use('/videos', videosRoutes);

app
    .listen(8080, () => {
        console.log('Hello World');
    })
