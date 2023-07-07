<template>
  <div>
    <div v-if="list&&list.length>0">
      <template v-if="type==1">
        <div class="item_box"  v-for="(item, index) in list" :key="index" @click="toDetail(item)">
          <div class="item_sty">
            <div>
              <el-tooltip
                v-if="item.title&&item.title.length>28"
                content="Top"
                placement="top"
                effect="light"
              >
                <span slot="content">{{item.title}}</span>
                <span class="title">{{item.title}}</span>
              </el-tooltip>
              <div class="title" v-else>{{item.title}}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="type==2">
        <div class="item_box top"  v-for="(item, index) in list" :key="index" @click="toDetail(item)">
          <div class="item_sty">
            <div>
              <el-tooltip
                v-if="item.fileName&&item.fileName.length>32"
                content="Top"
                placement="top"
                effect="light"
              >
                <span slot="content">{{item.fileName}}</span>
                <div class="flex_sty">
                  <span :class="['title_icon',index==0?'first':index==1?'second':index==2?'third':'other']">{{index+1}}</span>
                  <span class="title_sty">{{item.fileName}}</span>
                </div>
              </el-tooltip>
              <div class="flex_sty" v-else>
                <span :class="['title_icon',index==0?'first':index==1?'second':index==2?'third':'other']">{{index+1}}</span>
                <span class="title_sty">{{item.fileName}}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else :class="['nodata',type==2?'no-data':'']">
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    // 1-行业资讯 2-卧涛文档
    type: {
      type: Number,
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
    }
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
        window.open('/policy/' + item.industryNo + '101?id=' + item.id, '_self')
      }else if(this.type == 2){
        // 跳转卧涛文档详情页
        window.open('/policy/files/' + item.id, '_self')
      }
    }
  }

}
</script>

<style lang="stylus" scoped>
.top {
  margin-top: -12px;
}
.item_box {
  display: flex;
  flex-direction: column;
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
      width: 444px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      margin: 10px 0;
    }
    .title:before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #36a6fe;
      border-radius: 50%;
      margin-right: 4px;
    }
    .title_sty {
      display: inline;
      cursor: pointer;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Bold;
      font-weight: 700;
      color: #555555;
      line-height: 21px;
      letter-spacing: 0.84px;
      width: 429px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      margin: 10px 0;
    }
    .title_icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 4px;
      margin-right: 6px;
      font-size: 12px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.72px;
      text-align: center;
    }
    .first {
      background: #fe3636;
      color: #ffffff;
    }
    .second {
      background: #FF6D27;
      color: #ffffff;
    }
    .third {
      background: #36A6FE;
      color: #ffffff;
    }
    .other {
      background: #D9D9D9;
      color: #555555;
    }
    .flex_sty {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
  }
}
.nodata {
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  text-align: center;
  color: #b4b4b4;
  margin-top: 100px;
}
.no-data {
  margin-left: 150px;
}
</style>