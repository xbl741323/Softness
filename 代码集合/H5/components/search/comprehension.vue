<template>
    <div class="child-cont">
       <van-tree-select
          :items="items"
          :active-id.sync="itemId"
          :main-active-index.sync="navIndex"
          @click-nav="onNavClick"
          @click-item="onItemClick"
        />
    </div>
</template>

<script>
export default {
    props:["choosed","indexP", "indexC"],
    data() {
        return {
          items: [{
            id: 0,
            text: '企业服务',
            children: [{
              id: 0,
              text: '全部'
            },{
              id: 1,
              text: '项目申报'
            },{
              id: 2,
              text: '知识产权'
            },{
              id: 7,
              text: '工商财税'
            },{
              id: 9,
              text: '融资上市'
            },{
              id: 10,
              text: '法律服务'
            },{
              id: 11,
              text: '软件开发'
            }]
          },{
            id: 1,
            text: '政策广场',
            children:[{
              id: 0,
              text: '政策广场'
            }]
          },{
            id: 2,
            text: '技术转移',
            children:[{
              id: 0,
              text: '技术成果'
            },{
              id: 1,
              text: '技术需求'
            }]
          }],
          itemId: 0,
          navIndex: 0,
        };
    },
    methods: {
       // 左侧导航触发事件
        onNavClick(index){
          console.log(index)
          this.navIndex = index;
          this.$emit('navChange',index)
        },
        // 右侧导航触发事件
        onItemClick(data){
          this.itemId = data.id;
          this.$emit('itemChange',{
            navIndex: this.navIndex,
            item: data
          })
        }
    },
    mounted(){
      
    }
};
</script>

<style lang="stylus" scoped>
@import './search-child'
</style>
<style scoped>
.child-cont .van-tree-select__nav {
  width: 250px;
}
.child-cont .van-sidebar-item--select::before {
  background-color: #36A6FE;
}
.child-cont .van-tree-select__item--active{
  color: #36A6FE;
}
</style>
