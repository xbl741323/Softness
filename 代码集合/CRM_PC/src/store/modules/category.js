import { getStore, setStore } from '@/util/store'
import { getListPolicy } from "@/api/policy/list";
import { getClassifyList } from "@/api/siteSettings/classify";
import { getArea } from "@/api/clue/clue";
import { repeatDeptList } from "@/api/admin/user";
const category = {
  state: {
    category: getStore({ name: 'category' }) || [],
    area: getStore({ name: 'area' }) || [],
    dept: getStore({ name: 'dept' }) || [],
    notices: getStore({ name: 'notices' }) || {},
    policySelection: getStore({ name: 'policySelection' }) || [],
    troubleSelection: getStore({ name: 'troubleSelection' }) || [],
    industrySelection: getStore({ name: 'industrySelection' }) || [],
  },
  actions: {
    // 获取类目数据
    setCategory({ commit }) {
      return new Promise((resolve, reject) => {
        getClassifyList().then(res => {
          const data = res.data.data
          commit('SET_CATEGORY', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取设置地区数据
    setNotices({ commit }) {
      return new Promise((resolve, reject) => {
        getListPolicy(0).then(res => {
          const data = res.data.data;
          commit('SET_NOTICES', data)
          resolve()
        }).catch(error => {
          reject(error)
        });
        getListPolicy(1).then(res => {
          const data = res.data.data.selection;
          commit('SET_POLICY_SELECTION', data)
        }).catch(error => {
          reject(error)
        });
        getListPolicy(2).then(res => {
          const data = res.data.data.selection;
          commit('SET_TROUBLE_SELECTION', data)
        }).catch(error => {
          reject(error)
        });
        getListPolicy(10).then(res => {
          const data = res.data.data.selection;
          commit('SET_INDUSTRY_SELECTION', data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取地区数据
    setArea({ commit }) {
      return new Promise((resolve, reject) => {
        getArea().then(res => {
          const data = res.data.data
          commit('SET_AREA', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取部门数据
    setDept({ commit }) {
      return new Promise((resolve, reject) => {
        repeatDeptList().then(res => {
          const data = res.data.data
          commit('SET_DEPT', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_CATEGORY: (state, data) => {
      setStore({ name: 'category', content: data })
    },
    SET_AREA: (state, data) => {
      setStore({ name: 'area', content: data })
    },
    SET_DEPT: (state, data) => {
      setStore({ name: 'dept', content: data })
    },
    SET_NOTICES: (state, data) => {
      setStore({ name: 'notices', content: data })
    },
    SET_POLICY_SELECTION: (state, data) => {
      setStore({ name: 'policySelection', content: data })
    },
    SET_TROUBLE_SELECTION: (state, data) => {
      setStore({ name: 'troubleSelection', content: data })
    },
    SET_INDUSTRY_SELECTION: (state, data) => {
      setStore({ name: 'industrySelection', content: data })
    },
  }

}

export default category
