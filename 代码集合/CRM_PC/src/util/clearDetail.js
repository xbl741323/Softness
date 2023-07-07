// 清除列表路由sessionStorage信息
export function clearDetail(url) {
	if (sessionStorage.getItem(`${url}`)) {
		let keepParams = JSON.parse(sessionStorage.getItem(`${url}`))
		if (keepParams.detail) {
			keepParams.detail.path = ""
			keepParams.detail.query = {}
			sessionStorage.setItem(`${url}`, JSON.stringify(keepParams))
		}
	}
}

// 存储详情路由sessionStorage信息
export function saveDetal(url, path, query) {
	if (sessionStorage.getItem(`${url}`)) {
		let keepParams = JSON.parse(sessionStorage.getItem(`${url}`))
		keepParams.detail.path = path
		keepParams.detail.query = query
		sessionStorage.setItem(`${url}`, JSON.stringify(keepParams))
	}
	if(sessionStorage.getItem('clue-active-name')){
     sessionStorage.removeItem('clue-active-name')
	}
}