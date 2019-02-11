import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import mavonEditor from 'mavon-editor'
import Store from 'electron-store'

import 'mavon-editor/dist/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import CONSTANT from '../common/constant'
import langs from './locale'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(mavonEditor)

Vue.$db = Vue.prototype.$db = new Store()

let curLang = Vue.$db.get(CONSTANT.LANGUAGE)
if (!curLang) {
  curLang = 'en'
  Vue.$db.set(CONSTANT.LANGUAGE, curLang)
}

const i18n = new VueI18n({
  locale: curLang,
  messages: langs
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
