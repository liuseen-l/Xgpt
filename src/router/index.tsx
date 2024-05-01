import { Navigate, RouterProvider, createHashRouter } from 'react-router-dom'
import ChatAddPanel from '~/components/chat/chat-add-panel'
import ChatRoom from '~/components/chat/chat-room'
import PPTHome from '~/pages/ppt'
import PPTChat from '~/components/ppt/ppt-chat'
import Forget from '~/pages/forget'
import Home from '~/pages/home'
import Login from '~/pages/login'
import Register from '~/pages/register'
import Community from '~/components/ppt/ppt-community'
import Chat from '~/pages/chat'
import ComCenter from '~/components/ppt/community-center'
import ComLike from '~/components/ppt/community-like'
import ComUpload from '~/components/ppt/community-upload'

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
          path: '/chat',
          element: (
            <Navigate to="/chat/session" />
          ),
        },
      ],
    },
    {
      path: '/ppt',
      Component: PPTHome,
      children: [
        {
          path: 'chat',
          Component: PPTChat,
        },
        {
          path: 'community',
          Component: Community,
          children: [
            {
              path: 'center',
              Component: ComCenter,
            },
            {
              path: 'like',
              Component: ComLike,
            },
            {
              path: 'upload',
              Component: ComUpload,
            },
            {
              path: '/ppt/community',
              element: (
                <Navigate to="/ppt/community/center" />
              ),
            },
          ],

        },
        {
          path: '/ppt',
          element: (
            <Navigate to="/ppt/chat" />
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
