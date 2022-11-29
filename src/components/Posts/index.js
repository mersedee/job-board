import React from 'react';
import PostItem from './PostItem';

function Posts({ posts }) {
  return posts.length > 0
    ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
        {posts.map((post) => (
          <article key={post.id} data-testid="post">
            <PostItem
              id={post.id}
              title={post.title}
              time={post.time}
              url={post.url}
            />
          </article>
        ))}
      </div>
    )
    : (
      <div className="text-2xl h-[300px] flex items-center justify-center">
        Loading...
      </div>
    );
}

export default Posts;
