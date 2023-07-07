import store from '@/store'

export function closeTop(value) {
	let tagList = store.getters.tagList
	console.log(value)
	let { tag, key } = findTag(value)
	store.commit('DEL_TAG', tag)
	tag = tagList[key === 0 ? key : key - 1] // 如果关闭本标签让前推一个
    console.log(tag,"tag")
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