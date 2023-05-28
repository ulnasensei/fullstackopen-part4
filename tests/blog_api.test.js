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

    expect(response.body).toHaveLength(2);
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});