import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom'
import ChatAddPanel from '~/components/chat/chat-add-panel'
import IntroDuce from '~/components/chat/chat-introduce'
import ChatRoom from '~/components/chat/chat-room'
import Chat from '~/pages/chat'
import Forget from '~/pages/forget'
import Home from '~/pages/home'
import Login from '~/pages/login'
import Register from '~/pages/register'

export const router = createHashRouter(
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
          path: 'introduce',
          Component: IntroDuce,
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
      path: '/register',
      Component: Register,
    },
    {
      path: '/forget',
      Component: Forget,
    },
    {
      path: '/',
      element: (
        <Navigate to="/center" />
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

export function toLoginPage() {
  router.navigate('/login')
}
