import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import store from './store'

window.Toast = function(msg){
    let toastWrapper = document.createElement('div');
    toastWrapper.className = "toastWrapper";
    let toastContent = document.createElement('div');
    toastContent.className = "content"
    toastContent.textContent = msg;
    toastWrapper.appendChild(toastContent);
    document.body.appendChild(toastWrapper);
    setTimeout(() => {
        toastWrapper.remove();
    }, 2000);
        
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
