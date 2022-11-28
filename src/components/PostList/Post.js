import React from 'react';

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

function Post({
  id, title, time, url,
}) {
  return (
    <a href={url || `https://news.ycombinator.com/item?id=${id}`} target="_blank" rel="noreferrer">
      <div className="bg-white px-6 pt-6 pb-12 rounded-lg shadow-lg text-center relative">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 min-h-[80px]">
          {getContent(title)[0]}
        </h2>

        <p className="text-xl pb-2 min-h-[120px]">{getContent(title)[1]}</p>

        <div className="text-lg text-gray-700 absolute bottom-6 left-[50%]" style={{ transform: 'translate(-50%, 0)' }}>
          {getDate(time)}
        </div>
      </div>
    </a>
  );
}

export default Post;
