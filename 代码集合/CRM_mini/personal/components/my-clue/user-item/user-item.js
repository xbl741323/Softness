// personal/components/my-clue/user-item/user-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setValue(e){
      let data = e.currentTarget.dataset.item
      let userList = this.data.userList
      userList.forEach(item => {
        if(data.userId == item.userId){
          item.checked = true
        }else{
          item.checked = false
        }
      })
      this.setData({
        userList: userList
      })
      setTimeout(()=>{
        this.triggerEvent('userInfo', [data])
      },100)
    }
  }
})
