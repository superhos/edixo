import Vue from 'vue'
import Router from 'vue-router'
import CONSTANT from '../../common/constant'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/file',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/deploy',
      name: 'deploy-page',
      component: require('@/components/DeployPage').default
    },
    {
      path: '/',
      name: 'note-page',
      component: require('@/components/NotePage').default
    },
    {
      path: '/enter',
      name: 'enter-page',
      component: require('@/components/EnterPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.matched)
  console.log(to.matched.some(way => way.path === '/enter'))
  if (!Vue.$db.get(CONSTANT.HEXO_PROJ_PATH) && !to.matched.some(way => way.path === '/enter')) {
    next({
      path: '/enter',
      params: { nextUrl: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
