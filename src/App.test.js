import React from 'react';
import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { api, mockPostIds, mockPosts } from './static/constatnts';
import PostItem from './components/Posts/PostItem';
import Posts from './components/Posts';

const mockPost = mockPosts[0];

const getJobIDs = rest.get(`${api}jobstories.json`, (req, res, ctx) => res(
  ctx.status(200),
  ctx.json(mockPostIds),
));

const getJobs = rest.get(`${api}item/33766912.json`, (req, res, ctx) => res(
  ctx.status(200),
  ctx.json(mockPosts),
));

const handlers = [getJobIDs, getJobs];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Renders the component with loading state', async () => {
  render(<Posts posts={[]} />);
  await screen.findByText('Loading...');
});

test('Renders the component with posts', async () => {
  render(<Posts posts={mockPosts} />);
  const postsItems = await screen.getAllByTestId('post');
  expect(postsItems).toHaveLength(2);
});

test('Render PostItem component with post data', () => {
  render(
    <PostItem
      id={mockPost.id}
      title={mockPost.title}
      url={mockPost.url}
      time={mockPost.time}
    />,
  );
  screen.getByRole('heading', { level: 2, name: 'OneSignal (YC S11)' });
  screen.getByText('Is Hiring a Head of Developer Relations');
});
