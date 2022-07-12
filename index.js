const express = require('express');
const cors = require('cors');
const app = express();
const videosRoutes = require('./routes/videos');

app.use(express.json());

app.use(express.static('./public'))

app.use(cors());

app
    .get('/videos', (req, res) => {

        const videosData = fs.readFileSync('../data/videos.json');
        let videosDataParsed = JSON.parse(videosData);

        res.json(videosDataParsed)
    });

app
    .listen(8080, () => {
        console.log('Hello World')
    })
