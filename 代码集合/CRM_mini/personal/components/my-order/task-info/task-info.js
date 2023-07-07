// personal/components/my-order/task-info/task-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskInfo: {
      type: Object,
      required: false
    },
    orderStatus: {
      type: Number,
      required: true
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    //跳转任务进度页面
    showProgress() {
      let taskInfo = this.data.taskInfo
      let data = JSON.stringify({
        taskNo: taskInfo.taskNo,
        id: taskInfo.id,
        taskStatus: taskInfo.taskStatus
      })
      wx.navigateTo({
        url: `/personal/pages/my-order/detail/task-progress/task-progress?data=${data}`,
      });
    },
  }
})