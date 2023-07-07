import request from '@/router/axios'

export function getCommonList(type, params) {
	console.log(type, "sssssssssssssssssss")
	let url = ""
	switch (Number(type)) {
		case 1: // 财税服务
			url = '/wtcrm/fm/list'
			break;
		case 2: // 工商注册
			url = '/wtcrm/aicreg/list'
			break;
		case 3: // 法律服务
			url = '/wtcrm/lsrc/list'
			break;
		case 4: // 融资上市
			url = '/wtcrm/ipo/list'
			break;
		case 6: // 软件开发
			url = '/wtcrm/softwareDev/list'
			break;
	}
	return request({
		url: url,
		method: 'post',
		data: params
	})
}

export function getCommonDetail(type, id) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/getDetailById/' + id
			break;
		case 2:
			url = '/wtcrm/aicreg/getDetailById/' + id
			break;
		case 3:
			url = '/wtcrm/lsrc/getDetailById/' + id
			break;
		case 4:
			url = '/wtcrm/ipo/getDetailById/' + id
			break;
		case 6:
			url = '/wtcrm/softwareDev/getDetailById/' + id
			break;
	}
	return request({
		url: url,
		method: 'get'
	})
}

export function commonAdd(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/insertOne'
			break;
		case 2:
			url = '/wtcrm/aicreg/insertOne'
			break;
		case 3:
			url = '/wtcrm/lsrc/insertOne'
			break;
		case 4:
			url = '/wtcrm/ipo/insertOne'
			break;
		case 6:
			url = '/wtcrm/softwareDev/insertOne'
			break;
	}
	return request({
		url: url,
		method: 'post',
		data: params
	})
}

export function commonDelete(type, number, id) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/deleteOneById/' + number + '/' + id
			break;
		case 2:
			url = '/wtcrm/aicreg/deleteOneById/' + number + '/' + id
			break;
		case 3:
			url = '/wtcrm/lsrc/deleteOneById/' + number + '/' + id
			break;
		case 4:
			url = '/wtcrm/ipo/deleteOneById/' + number + '/' + id
			break;
		case 6:
			url = '/wtcrm/softwareDev/deleteOneById/' + number + '/' + id
			break;
	}
	return request({
		url: url,
		method: 'delete'
	})
}

export function commonSetBasic(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/updateOneBase'
			break;
		case 2:
			url = '/wtcrm/aicreg/updateOneBase'
			break;
		case 3:
			url = '/wtcrm/lsrc/updateOneBase'
			break;
		case 4:
			url = '/wtcrm/ipo/updateOneBase'
			break;
		case 6:
			url = '/wtcrm/softwareDev/updateOneBase'
			break;
	}
	return request({
		url: url,
		method: 'put',
		data: params
	})
}

export function commonSetDetail(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/updateOneDetail'
			break;
		case 2:
			url = '/wtcrm/aicreg/updateOneDetail'
			break;
		case 3:
			url = '/wtcrm/lsrc/updateOneDetail'
			break;
		case 4:
			url = '/wtcrm/ipo/updateOneDetail'
			break;
		case 6:
			url = '/wtcrm/softwareDev/updateOneDetail'
			break;
	}
	return request({
		url: url,
		method: 'put',
		data: params
	})
}

export function commonCheckName(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/checkName'
			break;
		case 2:
			url = '/wtcrm/aicreg/checkName'
			break;
		case 3:
			url = '/wtcrm/lsrc/checkName'
			break;
		case 4:
			url = '/wtcrm/ipo/checkName'
			break;
		case 6:
			url = '/wtcrm/softwareDev/checkName'
			break;
	}
	return request({
		url: url,
		method: 'get',
		params: params
	})
}

export function getCommomLog(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/getOperateRecordList/' + params.current + '/' + params.size + '/' + params.number
			break;
		case 2:
			url = '/wtcrm/aicreg/getOperateRecordList/' + params.current + '/' + params.size + '/' + params.number
			break;
		case 3:
			url = '/wtcrm/lsrc/getOperateRecordList/' + params.current + '/' + params.size + '/' + params.number
			break;
		case 4:
			url = '/wtcrm/ipo/getOperateRecordList/' + params.current + '/' + params.size + '/' + params.number
			break;
		case 6:
			url = '/wtcrm/softwareDev/getOperateRecordList/' + params.current + '/' + params.size + '/' + params.number
			break;
	}
	return request({
		url: url,
		method: 'get',
		params: params
	})
}

export function setCommontatus(type, params) {
	let url = ""
	switch (Number(type)) {
		case 1:
			url = '/wtcrm/fm/updateOneShowStatus/' + params.id + '/' + params.showStatus
			break;
		case 2:
			url = '/wtcrm/aicreg/updateOneShowStatus/' + params.id + '/' + params.showStatus
			break;
		case 3:
			url = '/wtcrm/lsrc/updateOneShowStatus/' + params.id + '/' + params.showStatus
			break;
		case 4:
			url = '/wtcrm/ipo/updateOneShowStatus/' + params.id + '/' + params.showStatus
			break;
		case 6:
			url = '/wtcrm/softwareDev/updateOneShowStatus/' + params.id + '/' + params.showStatus
			break;
	}
	return request({
		url: url,
		method: 'put',
	})
}
