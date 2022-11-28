import React from 'react';
import Post from './Post';

function PostList({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          time={post.time}
          url={post.url}
        />
      ))}
    </div>
  );
}

export default PostList;
