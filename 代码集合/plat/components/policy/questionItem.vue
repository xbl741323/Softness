<template>
  <div>
    <div class="item_box" v-if="type==1" @click="toDetail(item)">
       <el-tooltip
        v-if="item.title&&item.title.length>32"
        content="Top"
        placement="top"
        effect="light"
      >
        <span slot="content">{{item.title}}</span>
        <span class="a_title">{{item.title}}</span>
      </el-tooltip>
      <div class="a_title" v-else>{{item.title}}</div>
      <div class="time" v-if="item.createTime">{{item.createTime | filterTime}}</div>
      <div class="answer" v-if="item.answerCount">{{item.answerCount}}个回答</div>
      <div class="answer" v-else>0个回答</div>
    </div>
    <div class="item_box" v-else @click="toDetail(item)">
       <el-tooltip
        v-if="item.title&&item.title.length>46"
        content="Top"
        placement="top"
        effect="light"
      >
        <span slot="content">{{item.title}}</span>
        <span class="b_title">{{item.title}}</span>
      </el-tooltip>
      <div class="b_title" v-else>{{item.title}}</div>
      <div class="time" v-if="item.create_time">{{item.create_time | filterTime}}</div>
      <div class="answer" v-if="item.page_views">{{item.page_views}}浏览</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    // type 1-卧涛问答 2-行业资讯
    type: {
      type: Number,
      required: true
    }
  },
  filters: {
    filterTime(val) {
      if(val&&val.length>=10){
        return val.slice(0, 10)
      }
    },
    filterTime(val) {
      if(val){
        return val.slice(0, 10)
      }
    }
  },
  components: {

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
      if(this.type == 1){
        window.open('/policy/questionDetail?id='+ item.id, '_self')
      }else{
        window.open('/policy/' + item.industry_no + '101?id=' + item.id, '_self')
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
.item_box {
  display: flex;
  flex-direction: row;
  padding: 15px 0 13px 0;
  border-bottom: 0.5px solid #eaebef;
  .a_title {
    cursor: pointer;
    width: 542px;
    height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #555555;
    line-height: 21px;
    letter-spacing: 0.84px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
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
    margin-left: 16px;
    border-right: 1px solid #eaebef;
    padding-right: 12px;
  }
  .answer {
    cursor: pointer;
    height: 18px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Light;
    font-weight: 300;
    color: #7b7b7b;
    line-height: 21px;
    letter-spacing: 0.84px;
    margin-left: 16px;
  }
  .b_title {
    cursor: pointer;
    width: 530px;
    height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    color: #555555;
    line-height: 21px;
    letter-spacing: 0.84px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>