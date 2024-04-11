import { useEffect } from 'react'
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import ChatAddPanel from '~/components/chat/chat-add-panel'
import ChatRoom from '~/components/chat/chat-room'
import Chat from '~/pages/chat'

export const router = createBrowserRouter(
  [
    {
      path: '/chat',
      Component: Chat,
      children: [
        {
          path: 'session',
          Component: ChatRoom,
        },
        {
          path: 'addpanel',
          Component: ChatAddPanel,
        },
        {
          path: '/chat',
          element: (
            <Navigate to="/chat/session" />
          ),
        },
      ],
    },
    {
      path: '/',
      element: (
        <Navigate to="/chat" />
      ),
    },
  ],
)

function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router
