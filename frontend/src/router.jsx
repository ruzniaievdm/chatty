import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Root, Chat } from './routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: 'chat',
    children: [
      {
        path: ':roomName',
        element: <Chat />,
      },
    ],
  },
]);

export default router;
