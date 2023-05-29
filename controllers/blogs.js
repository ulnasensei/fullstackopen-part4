const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(notes);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  if (typeof request.body.title === 'undefined')
    return response.status(400).end();
  if (typeof request.body.url === 'undefined')
    return response.status(400).end();

  const user = await request.user;
  const { title, author, url, likes } = request.body;
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = await request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() === user._id.toString()) {
    blog.deleteOne({});
    return response.status(204).end();
  }
  response.status(401).end();
});

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const user = await request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() === user._id.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response.json(updatedBlog);
  }
});

module.exports = blogsRouter;
