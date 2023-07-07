import { getStore, setStore } from '@/util/store'
import { diff } from '@/util/util'
import website from '@/const/website'
import store from '@/store'

const isFirstPage = website.isFirstPage
const tagWel = website.fistPage
const tagObj = {
  label: '', // 标题名称
  value: '', // 标题的路径
  params: '', // 标题的路径参数
  query: '', // 标题的参数
  group: [] // 分组
}

// 处理首个标签
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false
  } else {
    list.forEach(ele => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false
      } else {
        ele.close = true
      }
    })
  }
}

function findTag(value) {
	let tagList = store.getters.tagList
	let tag, key
	tagList.map((item, index) => {
		if (item.value == value) {
			tag = item
			key = index
		}
	})
	return { tag: tag, key: key }
}

const navs = {
  state: {
    tagList: getStore({ name: 'tagList' }) || [],
    tag: getStore({ name: 'tag' }) || tagObj,
    tagWel: tagWel
  },
  actions: {},
  mutations: {
    ADD_TAG: (state, action) => {
      state.tag = action
      setStore({ name: 'tag', content: state.tag, type: 'session' })
      if (state.tagList.some(ele => diff(ele, action))) return
      state.tagList.push(action)
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_TAG: (state, action) => {
      // let { tag, key } = findTag(action.value)
      // state.tagList.splice(key,1)
      state.tagList = state.tagList.filter(item => {
        return !diff(item, action)
      })
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_ALL_TAG: (state) => {
      state.tagList = [state.tagWel]
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    },
    DEL_TAG_OTHER: (state) => {
      state.tagList = state.tagList.filter(item => {
        if (item.value === state.tag.value) {
          return true
        } else if (!website.isFirstPage && item.value === website.fistPage.value) {
          return true
        }
      })
      setFistTag(state.tagList)
      setStore({ name: 'tagList', content: state.tagList, type: 'session' })
    }
  }
}
export default navs
