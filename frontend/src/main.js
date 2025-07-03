import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import store from './store'
Vue.config.productionTip = false
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VCalendar from 'v-calendar';
Vue.use(VCalendar, {});


import { 
  faGripLines, 
  faPlusSquare, 
  faBookmark, 
  faUpload, 
  faLink, 
  faClock, 
  faCalendarAlt 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faGripLines, 
  faPlusSquare, 
  faBookmark, 
  faUpload, 
  faLink, 
  faClock, 
  faCalendarAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
import router from './router/routes'
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')


