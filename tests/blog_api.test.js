const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./api_test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async() => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map(blog => Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});
describe('blogs get', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('expect 2 blogs to be returned', async() => {
    const response = await api.get('/api/blogs ');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
  test('unique identifier property is named id', async() => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });

});

describe('blogs post', () => {
  test('blog saved successfully', async() => {
    const blog = new Blog({ title: 'testing post', author: 'test author', url: 'test url', likes: 1 });
    await blog.save();

    const response = await api.get('/api/blogs ');

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('likes set to 0 if missing from request', async() => {
    const blog = new Blog({ title: 'testing post', author: 'test author', url: 'test url' });
    const savedBlog = await blog.save();

    expect(savedBlog.likes).toEqual(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});