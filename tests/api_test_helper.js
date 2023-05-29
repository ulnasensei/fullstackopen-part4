const Blog = require('../models/blog');
const User = require('../models/user');


const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'url1',
    likes: 123
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'url2',
    likes: 125
  }

];

const initialUsers = [
  {
    username: 'admin',
    name: 'admin',
    password: 'admin'
  },
  {
    username: 'member',
    name: 'member',
    password: 'member'
  }
];
// const nonExistingId = async () => {
//   const blog = new Blog({ title: 'willremovethissoon' });
//   await blog.save();
//   await blog.deleteOne();

//   return blog._id.toString();
// };

const notesInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

module.exports = {
  initialBlogs, initialUsers, notesInDb, usersInDb,
  //   nonExistingId
};