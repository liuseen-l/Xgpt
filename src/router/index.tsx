import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import ChatAddPanel from '~/components/chat/chat-add-panel'
import ChatRoom from '~/components/chat/chat-room'
import Chat from '~/pages/chat'
import Home from '~/pages/home'
import Login from '~/pages/login'

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
      path: '/center',
      Component: Home,
    },
    {
      path: '/login',
      Component: Login,
    },
    {
      path: '/',
      element: (
        <Navigate to="/login" />
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
