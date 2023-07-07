// personal/components/my-task/mission-item/mission-item.js
import {
  getProgressList
} from "../../../../utils/api/mytask"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    logsList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList() {
      getProgressList(this.properties.taskInfo.id).then(res => {
        if (res.code == 0) {
          this.setData({
            logsList: res.data
          })
        }
      })

    }
  }
})