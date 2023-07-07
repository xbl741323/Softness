<template>
  <div>
    <div class="item_box" @click="toDetail(item)">
      <div class="item_sty">
        <div>
          <el-tooltip
            v-if="item.title&&item.title.length>38"
            content="Top"
            placement="top"
            effect="light"
          >
            <span slot="content">【{{item.level | filterLevel}}】{{item.title}}</span>
            <span class="title">【{{item.level | filterLevel}}】{{item.title}}</span>
          </el-tooltip>
          <div class="title" v-else>【{{item.level | filterLevel}}】{{item.title}}</div>
        </div>
        <div v-if="item.applyType" :class="['state', item.applyType==1?'orange':item.applyType==2?'blue':'grey']">
          {{item.applyType | filterState}}
        </div>
      </div>
      <div>
        <div class="time">
          <span>发布时间： {{item.create_time | filterTime}}</span>&nbsp;&nbsp;
          <span v-if="item.applyType">起止时间：{{item.apply_start_time}}——{{item.apply_end_time}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  components: {

  },
  filters: {
    filterState(val) {
      return val == 1 ? '未开始' : val == 2 ? '申报中' : val == 3 ? '已结束' : ''
    },
    filterTime(val) {
      if(val&&val.length>=10){
        return val.slice(0, 10)
      }
    },
    filterLevel(val) {
      return val == 1 ? '国家级': val == 2 ? '省级' : val == 3 ? '市级': val == 4 ? '区级': ''
    },
  },
  data () {
    return {

    }
  },

  created () {

  },

  mounted () {

  },

  methods: {
    toDetail(item){
      window.open('/policy/' + item.number + '01?id=' + item.id, '_self')
    }
  }

}
</script>

<style lang="stylus" scoped>
.item_box {
  display: flex;
  flex-direction: column;
  margin: 0 17px 6px 26px;
  border-bottom: 0.5px solid #eaebef;
  .item_sty {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      cursor: pointer;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      color: #555555;
      line-height: 21px;
      letter-spacing: 0.84px;
      width: 720px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      margin-bottom: 4px;
    }
    .state {
      width: 48px;
      height: 19px;
      line-height: 19px;
      border-radius: 0px 0px 0px 4px;
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Light;
      font-weight: 300;
      text-align: center;
      line-height: 21px;
      letter-spacing: 0.72px;
    }
    .blue {
      background: #36a6fe;
      color: #ffffff;
    }
    .orange {
      background: #FA7F49;
      color: #ffffff;
    }
    .grey {
      background: #f1f1f1;
      color: #b4b4b4;
    }
  }
  .time {
    cursor: pointer;
    height: 18px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Light;
    font-weight: 300;
    color: #7b7b7b;
    line-height: 21px;
    letter-spacing: 0.84px;
    margin-bottom: 6px;
    span:nth-child(1) {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Light;
      font-weight: 300;
      color: #b4b4b4;
      line-height: 21px;
      letter-spacing: 0.84px;
    }
    span:nth-child(2) {
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Light;
      font-weight: 300;
      color: #6c6c6c;
      line-height: 21px;
      letter-spacing: 0.84px;
    }
  }
}
</style>