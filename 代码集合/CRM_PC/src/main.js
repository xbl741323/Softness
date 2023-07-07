import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import router from './router/router'
import store from './store'
import { loadStyle } from './util/util'
import * as urls from '@/config/env'
import { iconfontUrl, iconfontVersion, imgUrl } from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import './assets/css/main.css'
import AvueFormDesign from 'pig-avue-form-design'
import basicContainer from './components/basic-container/main'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import Maxlength from 'vue_input_maxlength'
import globalThrottle from '@/util/common.js'
import preventReClick from '@/util/preventReClick' //防多次点击，重复提交
import * as CodeMsg from "@/api/common/CodeChange"
import 'default-passive-events'
// 阿里云上传sdk
import '@/util/aliyun-upload-sdk/lib/aliyun-oss-sdk-6.17.1.min'
import '@/util/aliyun-upload-sdk/aliyun-upload-sdk-1.5.3.min'
import { notAuthorized } from './util/notAuthorized'
import { loop } from './util/loop'
import { mixin } from '@/mixins/userInfo' //员工信息
Vue.mixin(mixin)
// 插件 json 展示
Vue.use(globalThrottle)
Vue.use(Maxlength)
Vue.use(router)
Vue.use(moment)
Vue.prototype.$moment = moment;
Vue.prototype.$permissions = store.state.user.permissions
Vue.prototype.$notAuthorized = notAuthorized;
Vue.prototype.$loop = loop;
Vue.use(AvueFormDesign);
Vue.use(VueAxios, axios)
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'small',
  menuType: 'text'
})

Vue.use(window.AVUE, {
  size: 'small',
  menuType: 'text'
})

window.CodeMsg = CodeMsg;
//定义标识符
const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./lang/cn'),   // 中文语言包
    'en-US': require('./lang/en')    // 英文语言包
  }
});

const $offsetMessage = options => {
  return Message({
    ...options,
    offset: 300,
    duration: 1500,
  });
};
['success', 'warning', 'info', 'error'].forEach(type => {
  $offsetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return Message(options);
  };
});
Vue.prototype.$offsetMessage = $offsetMessage;

// 注册全局容器
Vue.component('basicContainer', basicContainer)

// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
