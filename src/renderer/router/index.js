import Vue from 'vue'
import Router from 'vue-router'
import CONSTANT from '../../common/constant'
import Store from 'electron-store'

Vue.use(Router)
const db = new Store()

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
      path: '/select',
      name: 'select-folder',
      component: require('@/components/SelectFolder').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.matched)
  console.log(to.matched.some(way => way.path === '/select'))
  if (!db.get(CONSTANT.HEXO_PROJ_PATH) && !to.matched.some(way => way.path === '/select')) {
    next({
      path: '/select',
      params: { nextUrl: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
