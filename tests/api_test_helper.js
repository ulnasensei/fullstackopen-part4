const Blog = require('../models/blog');


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

module.exports = {
  initialBlogs, notesInDb,
//   nonExistingId
};