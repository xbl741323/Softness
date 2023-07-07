
import KindEditor from '@/components/editor/kindeditor'
const install = function(Vue) {
    if (install.installed) return
    install.installed = true
    Vue.component('editor', KindEditor)
}
 
export default install