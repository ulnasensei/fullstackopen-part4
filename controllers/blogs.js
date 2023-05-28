const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({});
  response.json(blogs);

});

blogsRouter.post('/', async (request, response) => {
  if (typeof(request.body.title) === 'undefined') return response.status(400).end();
  if (typeof(request.body.url) === 'undefined') return response.status(400).end();
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);

});

blogsRouter.delete('/:id', async(request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async(request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
