const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prev, current) => {
    if (current.likes > prev.likes) return current;
    else return prev;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorsAndNumbers = Object.keys(groupedByAuthor).map((key) => ({
    author: key,
    blogs: groupedByAuthor[key].length,
  }));

  return authorsAndNumbers.reduce((prev, current) => {
    if (current.blogs > prev.blogs) return current;
    else return prev;
  });
};

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');
  const authorsAndTotalLikes = Object.keys(groupedByAuthor).map((key) => {
    const totalLikes = groupedByAuthor[key].reduce((total, blog) => total + blog.likes, 0);
    return { author: key, likes: totalLikes };
  });

  return authorsAndTotalLikes.reduce((prev, current) => {
    if (current.likes > prev.likes) return current;
    else return prev;
  });
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
