import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import category from './modules/category'
import getters from './getters'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    category
  },
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        // 只储存state中的assessmentData
        category: val.category
      }
    }
  })]
})

export default store
