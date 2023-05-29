const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./api_test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const userPromises = helper.initialUsers.map((user) =>
    api.post('/api/users').send(user)
  );
  let users = await Promise.all(userPromises);
  users = users.map((user) => user.body);
  const admin = await User.findById(users[0].id);
  const blogObjects = helper.initialBlogs.map((blog) =>
    Blog({ ...blog, user:  admin._id })
  );
  const blogPromises = blogObjects.map((blog) => blog.save());
  await Promise.all(blogPromises);
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
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${session.body.token}`)
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

  test('blog save fails with no token', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'testing post',
        author: 'test author',
        url: 'test url',
        likes: 1,
      })
      .expect(401);
  });

  test('likes set to 0 if missing from request', async () => {
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        title: 'testing post with no likes',
        author: 'test author 2',
        url: 'test url 2',
      })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(savedBlog.body.likes).toEqual(0);
  });
  test('return 400 if title is missing from request', async () => {
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        author: 'test author 3',
        url: 'test url 3',
        likes: 1,
      })
      .expect(400);
  });
  test('return 400 if url is missing from request', async () => {
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({
        title: 'testing no url request',
        author: 'test author 4',
        likes: 1,
      })
      .expect(400);
  });
});

describe('blogs delete', () => {
  test('delete blog by id', async () => {
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    const blogs = await api.get('/api/blogs');

    const id = blogs.body[0].id;

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .expect(204);
  });
});

describe('blogs update', () => {
  test('update blog by id', async () => {
    const session = await api
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' });
    const blogs = await api.get('/api/blogs');

    const id = blogs.body[0].id;

    const updatedBlog = await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${session.body.token}`)
      .send({ likes: 200 })
      .expect(200);

    expect(updatedBlog.body.likes).toEqual(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
