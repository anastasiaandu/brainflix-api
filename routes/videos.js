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
//GET
router
    .get('/', (req, res) => {
        const videosData = readVideos();

        const filteredData = videosData.map((video) => {
            return {
                id: video.id,
                title: video.title,
                channel: video.channel,
                image: video.image
            }
        });
        
        res.status(200).json(filteredData);
    });


//create endpoint to get specific video
//GET
router
    .get('/:id', (req, res) => {
        const videoId = req.params.id;
        const videosData = readVideos();
        const selectedVideo = videosData.find(video => video.id === videoId);

        if(!selectedVideo){
            res.status(404).send('The video does not exist');
            return
        }

        res.status(200).json(selectedVideo);
    });


//create endpoint to post new video
//POST
router
    .post('/', (req, res) => {

        if (!req.body.title || !req.body.description) {
            res.status(400).send('Title and description are required fields');
            return
        }

        const videosData = readVideos();

        const newVideo = {
            title: req.body.title,
            channel: 'Scene One',
            image: 'http://localhost:8080/images/Upload-video-preview.jpg',
            description: req.body.description,
            views: '12,400,600',
            likes: '24',
            duration: '5:03',
            video:'https://project-2-api.herokuapp.com/stream',
            timestamp: Date.now(),
            comments: [],
            id: uniqid()
        }

        videosData.push(newVideo)

        fs.writeFileSync('./data/videos.json', JSON.stringify(videosData));

        res.status(201).json(newVideo);
    });


//create endpoint to like a video
//PUT
router  
    .put('/:videoId/likes', (req, res) => {
        const videoId = req.params.videoId;
        const videosData = readVideos();
        const likedVideo = videosData.find(video => video.id === videoId);

        likedVideo.likes = ((+likedVideo.likes.replace(/,/g, '')) + 1).toLocaleString('en-US');

        fs.writeFileSync('./data/videos.json', JSON.stringify(videosData));
        
        res.status(200).json(likedVideo);

    });


// create endpoint to delete a video
//DELETE
router
    .delete('/:id', (req, res) => {
        const videoId = req.params.id;
        const videosData = readVideos();
        
        const filteredData = videosData.filter(video => video.id !== videoId);

        fs.writeFileSync('./data/videos.json', JSON.stringify(filteredData));

        res.status(200).json(filteredData);
    });


//create endpoint to post a new comment to videos
//POST
router
    .post('/:id/comments', (req, res) => {
        
        if (!req.body.comment) {
            res.status(400).send('Comment is a required field');
            return
        }

        const videoId = req.params.id;
        const videosData = readVideos();
        const selectedVideo = videosData.find(video => video.id === videoId);

        const authors = ['Meryl Streep', 'Barbra Streisand', 'Julianne Moore', 'Emma Watson']

        const newComment = {
            name: authors[Math.floor(Math.random() * authors.length)],
            comment: req.body.comment,
            likes: 0,
            timestamp: Date.now()
        }

        selectedVideo.comments.push(newComment);

        fs.writeFileSync('./data/videos.json', JSON.stringify(videosData));

        res.status(200).json(newComment);
    });


//create endpoint to like a comment on a video
//PUT
router  
    .put('/:videoId/comments/:commentId/likes', (req, res) => {
        const videoId = req.params.videoId;
        const commentTimestamp= req.body.timestamp;
        const videosData = readVideos();

        const selectedVideo = videosData.find(video => video.id === videoId);
        const likedComment = selectedVideo.comments.find(comment => comment.timestamp === commentTimestamp);

        likedComment.likes++;

        fs.writeFileSync('./data/videos.json', JSON.stringify(videosData));
        
        res.status(200).json(selectedVideo);
    });


//create endpoint to delete a comment on a video
//DELETE
router
    .delete('/:videoId/comments/:commentId', (req, res) => {
        const videoId = req.params.videoId;
        const commentTimestamp = req.body.timestamp;
        const videosData = readVideos();

        const selectedVideo = videosData.find(video => video.id === videoId);
        const deletedComment = selectedVideo.comments.find(comment => comment.timestamp === commentTimestamp);
        const filteredComments = selectedVideo.comments.filter(comment => comment !== deletedComment);

        selectedVideo.comments = filteredComments;

        fs.writeFileSync('./data/videos.json', JSON.stringify(videosData));
        
        res.status(200).json(videosData);
    });


module.exports = router;
