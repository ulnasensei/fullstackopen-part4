const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./api_test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
describe('blogs get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('expect 2 blogs to be returned', async () => {
    const response = await api.get('/api/blogs ');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('blogs post', () => {
  test('blog saved successfully', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'testing post',
        author: 'test author',
        url: 'test url',
        likes: 1,
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs ');

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('likes set to 0 if missing from request', async () => {
    const savedBlog = await api
      .post('/api/blogs')
      .send({
        title: 'testing post with no likes',
        author: 'test author 2',
        url: 'test url 2',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(savedBlog.body.likes).toEqual(0);
  });
  test('return 400 if title is missing from request', async() => {
    await api
      .post('/api/blogs')
      .send({
        author: 'test author 3',
        url: 'test url 3',
        likes: 1
      })
      .expect(400);
  });
  test('return 400 if url is missing from request', async() => {
    await api
      .post('/api/blogs')
      .send({
        title: 'testing no url request',
        author: 'test author 4',
        likes: 1
      })
      .expect(400);
  });
});

describe('blogs delete', () => {
  test('delete blog by id', async() => {
    const blogs = await api.get('/api/blogs');

    const id = blogs.body[0].id;

    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
