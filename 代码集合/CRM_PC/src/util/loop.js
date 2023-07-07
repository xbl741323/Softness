//拼接工号
export function loop(val,obj){
    if (val.children) {
        val.children.forEach((item, index) => {
            if (item.customerNo) {
                item.label = item.label+"("+item.customerNo+")"
            }
            obj.children[index] = Object.assign({},item)
            loop(item,obj.children[index])
        })
    }
    return obj
}