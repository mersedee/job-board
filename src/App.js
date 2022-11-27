import React, { useState, useEffect } from 'react';
import './App.css';

const api = 'https://hacker-news.firebaseio.com/v0/';
const postsMaxLength = 60;

const getContent = (title) => {
  const index = title.toLowerCase().indexOf('is');
  const first = title.substr(0, index - 1);
  const second = title.substr(index, title.length - index);
  const formattedSecond = second.charAt(0).toUpperCase() + second.slice(1);
  return [first, formattedSecond];
};

const getDate = (timestamp) => {
  const dateFormat = new Date(timestamp * 1000);
  return `${dateFormat.getDate()}/${dateFormat.getMonth() + 1}/${dateFormat.getFullYear()}`;
};

function App() {
  const [posts, setPosts] = useState([]);
  const [jobStories, setJobStories] = useState([]);
  const [postsSlice, setPostsSlice] = useState([0, 9]);
  const [loading, setLoading] = useState(false);

  async function fetchJobs() {
    try {
      const jobIds = await fetch(`${api}jobstories.json`);
      const jobIdsJson = await jobIds.json();
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
              {posts.map((post) => (
                <a href={post.url || `https://news.ycombinator.com/item?id=${post.id}`} target="_blank" rel="noreferrer" key={post.id}>
                  <div className="bg-white px-6 pt-6 pb-12 rounded-lg shadow-lg text-center relative">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 min-h-[80px]">
                      {getContent(post.title)[0]}
                    </h2>

                    <p className="text-xl pb-2 min-h-[120px]">{getContent(post.title)[1]}</p>

                    <div className="text-lg text-gray-700 absolute bottom-6 left-[50%]" style={{ transform: 'translate(-50%, 0)' }}>
                      {getDate(post.time)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
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
