import { Message } from 'element-ui'
export function notAuthorized(title) {
    Message({
        message: title ? title : '权限不足',
        type: 'warning',
        offset: 300
    })
}