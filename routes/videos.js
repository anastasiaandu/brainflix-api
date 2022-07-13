const express = require('express');
const router = express.Router();
const fs = require('fs');
const uniqid = require('uniqid');


//create function to read videos file
const readVideos = () => {
    const videosDataFile = fs.readFileSync('./data/videos.json');
    const videosData = JSON.parse(videosDataFile);
    return videosData;
}

//create endpoint to get all videos
router
    .get('/', (req, res) => {
        const videosData = readVideos();
        res.status(200).json(videosData);
    });

//create endpoint to get selected video
router
    .get('/:id', (req, res) => {
        const videoId = req.params.id;
        const videosData = readVideos();
        const selectedVideo = videosData.find(video => video.id === videoId);

        if(!selectedVideo){
            res.status(404).send('The selected video does not exist');
            return
        }

        res.status(200).json(selectedVideo);
    });

//create endpoint to post new video
router
    .post('/', (req, res) => {
        const videosUploadData = req.body;
        console.log('Request Body: ', videosUploadData);

        if (!req.body.title || !req.body.description) {
            res.status(400).send('Title and description are required fields');
            return
        }

        const videosData = readVideos();

        const newVideo = {
            id: uniqid(),
            title: req.body.title,
            description: req.body.description,
        }

        videosData.push(newVideo)

        fs.writeFileSync('./routes/videos.json', JSON.stringify(videosData));

        res.status(200).json(newVideo);
    });


module.exports = router;
