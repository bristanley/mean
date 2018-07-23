const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://brian:Ca8tG4HA89SYxgli@cluster0-qgal3.mongodb.net/node-angular?retryWrites=true')
	.then(() => {
		console.log('Connected to database');
	})
	.catch(() => {
		console.log('Connection Failed');
	})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Request-With, Content-Type, Accept'
	)
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, PUT, DELETE, OPTIONS'
	)
    next();
});

app.put('/api/post/:id', (req, res, next) => {
	const post = new Post({
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content
	})
	Post.updateOne({_id: req.params.id}, post).then(result => {
		console.log(result);
		res.status(200).json({ message: 'Update Successful' });
	})
})

app.post("/api/post", (req, res, next) => {
	const post = new Post({
		title: req.body.title,
		content: req.body.content
	});
	post.save().then(result => {
		res.status(201).json({
			message: 'Post added!',
			postId: result._id
		});
	})
})

app.get('/api/post', (req, res, next) => {
	Post.find().then(documents => {
		res.status(200).json({
			message: "Post fetched successfully",
			posts: documents
		});
	});

});


app.delete("/api/post/:id", (req, res, next) => {
	Post.deleteOne({_id: req.params.id}).then(result => {
		console.log(result);
		res.status(200).json({ message: 'Post deleted' });
	})	
});

module.exports = app;