<template>
  <div class="header_nav">
    <div class="nav_item_contain">
      <template v-for="(item, index) in navList">
        <a
          :class="['nav_item', navId == item.id ? 'nav_active_item' : '']"
          :key="index"
          :href="item.pathUrl+'?id='+item.id+'&name='+item.name+'&type='+item.bannerType+'&page=1'+'&oneId='+item.id"
          @mouseenter="showId = item.id"
          @mouseleave="showId = null"
          target="_self"
          v-if="item.childrenColumnVoList.length == 0"
          >
          <span :class="['nav_item_title',showId == item.id ? 'nav_active_item' : '',]">{{ item.name }}</span>
        </a>
        <div
          :class="['nav_item', navId == item.id ? 'nav_active_item' : '']"
          :key="index"
          @click="linkTo(item)"
          @mouseenter="showId = item.id"
          @mouseleave="showId = null"
          v-else
          >
          <span :class="['nav_item_title',showId == item.id ? 'nav_active_item' : '',]">{{ item.name }}</span>
          <div v-if="showId == item.id" class="two_nav_contain">
            <a
              @mouseenter="childId = child.id"
              @mouseleave="childId = null"
              :href="child.pathUrl+'?id='+child.id+'&name='+child.name+'&type='+child.bannerType+'&page=1&childId='+child.id+'&oneId='+item.id"
              :class="[childId == child.id ? 'item_child_active' : '', childId1 == child.id && navId == item.id ? 'two_active' : '']"
              v-for="(child, cindex) in item.childrenColumnVoList"
              :key="cindex">
              {{ child.name }}
              </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getColumnList } from "@/api/home";
import * as CodeMsg from "@/utils/code";
import axios from 'axios'
export default {
  data() {
    return {
      childId: null,
      navId: null,
      showId: null,
      childId1: null,
      navList: [],
    };
  },
  async asyncData(){
    if(process.server){
      const res = await axios.get(process.env.ASYNC_DATA_API+'/hfxl/column/listColumn?substationId=20');
      const navList = [];
      if(res.data.code ==0){
        res.data.data.forEach(item => {
          if (item.status == 0) {
            switch (item.type) {
              case 0:
                item.pathUrl = "/graphic-content";
                // this.$set(item,'path',"/graphic-content");
                break;
              case 1:
                item.pathUrl = "/article-list";
                // this.$set(item,'path',"/article-list");
                break;
              case 2:
                item.pathUrl = "/graphic-list";
                // this.$set(item,'path',"/graphic-list");
                break;
              case 3:
                item.pathUrl = "/picture-list";
                // this.$set(item,'path','/picture-list')
                break;
              case 4:
                item.pathUrl = "/";
                break;
              default:
                item.pathUrl = "/";
                // this.$set(item,'path','/');
                break;
            }
            if (item.childrenColumnVoList) {
              item.childrenColumnVoList.forEach(child => {
                switch (child.type) {
                  case 0:
                    child.pathUrl = "/graphic-content";
                    // this.$set(item,'path',"/graphic-content");
                    break;
                  case 1:
                    child.pathUrl = "/article-list";
                    // this.$set(item,'path',"/article-list");
                    break;
                  case 2:
                    child.pathUrl = "/graphic-list";
                    // this.$set(item,'path',"/graphic-list");
                    break;
                  case 3:
                    child.pathUrl = "/picture-list";
                    // this.$set(item,'path','/picture-list')
                    break;
                  case 4:
                    child.pathUrl = "/";
                    break;
                  default:
                    child.pathUrl = "/";
                    // this.$set(item,'path','/');
                    break;
                }
              })
            }
            navList.push(item);
          }
        });
        return {
          navList: navList
        };
      }else{
        return [];
      };
    }
  },
  mounted() {
    // this.getList();
    this.getNavIndex();
  },
  methods: {
    getList() {
      getColumnList({substationId:20}).then((res) => {
        if (res.code == CodeMsg.CODE_0) {
          this.navList = [];
          res.data.forEach((item) => {
            if (item.status == 0) {
              this.navList.push(item);
            }
          });
        }
      });
    },
    toList(val, cindex, child) {
      let routerObj = {};
      switch (child ? child.type : val.type) {
        case 0:
          routerObj = { path: "/graphic-content", query: { id: child ? child.id : val.id, name:val.name, type: val.bannerType, oneId: val.id} };
          if (cindex > -1) {
            this.childId1 = child.id
            routerObj.query.childId = child.id
          }
          break;
        case 1:
          if(val.id == 161){
            sessionStorage.removeItem("trouble-filter")
          }
          routerObj = { path: "/article-list", query: { id: child ? child.id : val.id, type: val.bannerType, oneId: val.id } };
          if (cindex > -1) {
            this.childId1 = child.id
            routerObj.query.childId = child.id
          }
          break;
        case 2:
          routerObj = { path: "/graphic-list", query: { id: child ? child.id : val.id, type: val.bannerType, oneId: val.id } };
          if (cindex > -1) {
            this.childId1 = child.id
            routerObj.query.childId = child.id
          }
          break;
        case 3:
          routerObj = { path: "/picture-list", query: { id: child ? child.id : val.id, type: val.bannerType, oneId: val.id } };
          if (cindex > -1) {
            this.childId1 = child.id
            routerObj.query.childId = child.id
          }
          break;
        case 4:
          routerObj = { path: "/" };
          break;
        case 5:
          routerObj = { path: "/notice", query: { id: val.id }  };
          break;
        case 6:
          routerObj = { path: "/aboutWT?id=3&type=0", query: { id: val.id } };
          break;
        default:
          routerObj = { path: "/" };
          break;
      }
      this.$router.push(routerObj);
    },
    linkTo(val) {
      this.navId = val.id;
      if (val.isTwo == 1) {
        return this.toList(val, 0, val.childrenColumnVoList[0])
      }
      this.toList(val);
    },
    getNavIndex() {
      if(this.$route.path == '/'){
        this.navId = 35
      }else{
        if (this.$route.query.oneId) {
         this.navId = this.$route.query.oneId;
         if (this.$route.query.childId) {
          this.childId1 = this.$route.query.childId;
         } else {
          this.childId1 = null
         }
        } else {
          this.navId = 35
        }
      }
    },
  },
};
</script>

<style scoped>
.header_nav {
  width: 100%;
  height: 50px;
  top: 60px;
  position: absolute;
  background: #ffffff;
  border-bottom: 2px solid #93B874;
}
.nav_item_contain {
  width: 1190px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.nav_item {
  position: relative;
  flex: 1;
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #333;
  margin-right: 10px;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_active_item {
  color: #ffffff;
  background: #93B874;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}
.nav_item_title {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.5s;
  border-radius: 5px 5px 0px 0px;
  text-decoration: none;
}

.two_nav_contain {
  position: absolute;
  top: 40px;
  width: 100%;
  background: #93B874;
  border-radius: 0px 0px 5px 5px;
  z-index: 10000;
}
.two_nav_contain a {
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border-top: 1px solid #ffffff;
  text-decoration: none;
}
.two_nav_contain > a:last-of-type {
  border-radius: 0px 0px 5px 5px;
}
.item_child_active {
  background: #93B874;
}
.two_active{
  background: #93B874;
}
</style>
