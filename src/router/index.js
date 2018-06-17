import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 路由表
// 每次路
let user = [
  {
    path: '/login',
    component: () => import('../view/user/UserFrame.vue'),
    meta: { name: 'login' }
  },
  {
    path: '/register',
    component: () => import('../view/user/UserFrame.vue'),
    meta: {name: 'register'}
  },
  {
    path: '/reset-pass',
    component: () => import('../view/user/ResetPassword.vue')
  }
]
let picture = [
  {
    path: '/picture-wall',
    component: () => import('../view/picture-wall/PictureWall.vue')
  }
]
// 动态
let issue = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/issue/:friendId',
    component: () => import('../view/issue/Issue.vue'),
    props: true
  },
  {
    path: '/zone',
    component: () => import('../view/issue/Zone.vue')
  }
]
// 个人中心
let profile = [
  {
    path: '/profile',
    component: () => import('../view/profile/ProfileFrame.vue'),
    children:
    [
      {
        path: '',
        component: () => import('../view/profile/Setting.vue')
      },
      {
        path: 'setting',
        component: () => import('../view/profile/Setting.vue')
      },
      {
        path: 'banner-setting',
        component: () => import('../view/profile/BannerSetting.vue')
      },
      {
        path: 'avatar-setting',
        component: () => import('../view/profile/AvatarSetting.vue')
      }
    ]
  }
]
// 聊天室
let chatroom = [
  {
    path: '/chatroom',
    component: () => import('../view/chatroom/ChatFrame.vue')
  }
]
let other = [
  {
    path: '/internal-error',
    component: () => import('../view/common/500.vue'),
    meta: {title: "服务器错误"}
  },
  {
    path: '/not-find',
    component: () => import('../view/common/404.vue'),
    meta: {title: "404页面找不到"}
  },
  {
    path: '*',
    redirect: '/not-find',
    meta: {title: "404页面找不到"}
  }
]
let routes = [].concat(user, issue, picture, profile, chatroom, other);

const router = new VueRouter({
 // mode: 'history',
  routes: routes
})

export default router;
