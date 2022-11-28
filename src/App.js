import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';
import './App.css';

const api = 'https://hacker-news.firebaseio.com/v0/';
const postsMaxLength = 60;

function App() {
  const [posts, setPosts] = useState([]);
  const [jobStories, setJobStories] = useState([]);
  const [postsSlice, setPostsSlice] = useState([0, 9]);
  const [loading, setLoading] = useState(false);

  async function fetchJobs() {
    try {
      const jobIDsRes = await fetch(`${api}jobstories.json`);
      if (jobIDsRes.ok === false) {
        throw new Error(`Response Error: ${jobIDsRes.text}`);
      }
      const jobIdsJson = await jobIDsRes.json();
      setJobStories(jobIdsJson);

      const jobs = await jobIdsJson.slice(0, 9).map((id) => (
        fetch(`${api}item/${id}.json`).then((res) => res.json())
      ));
      const result = await Promise.all(jobs);

      setPosts(result);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMore() {
    setLoading(true);

    const sliceStartIndex = postsSlice[1];
    const sliceEndIndex = postsSlice[1] + 6;
    setPostsSlice([sliceStartIndex, sliceEndIndex]);

    try {
      const jobs = jobStories.slice(sliceStartIndex, sliceEndIndex).map((id) => (
        fetch(`${api}item/${id}.json`).then((res) => res.json())
      ));
      const result = await Promise.all(jobs);

      setPosts([...posts, ...result]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="App min-h-[100vh]">
      <div className="px-4 py-20 md:p-20">
        <h1 className="text-orange-700 mb-4 text-5xl font-bold text-center">
          HN Jobs
        </h1>

        {posts.length > 0
          ? (
            <PostList posts={posts} />
          )
          : (
            <div className="text-2xl h-[300px] flex items-center justify-center">
              Loading...
            </div>
          )}

        {posts.length > 0 && posts.length !== postsMaxLength
          && (
            <button
              type="button"
              className="block mx-auto text-xl text-orange-700 border border-solid border-orange-700 mt-10 rounded-lg px-5 py-3"
              onClick={loadMore}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
      </div>
    </div>
  );
}

export default App;
