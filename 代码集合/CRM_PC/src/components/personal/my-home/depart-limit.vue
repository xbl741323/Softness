<template>
  <div v-if="showCount <= 0"></div>
  <div v-else :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
export default {
  data() {
    return {
      className: "chart",
      width: "100%",
      height: "365px",
      showCount: 0,
      chart: null,
      max: 0,
      title: "回款金额（元）",
      serviceInfo: {
        nameList: [],
        dataList: [{ value: 0 }],
        colorList: [],
        valueList: [],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    refreshData() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    initChart() {
      let _this = this;
      var valueList = this.serviceInfo.valueList;
      var colors = ["#409eff"];
      var colorsTitle = this.serviceInfo.colorList;
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        grid: {},
        color: colors[0],
        legend: {
          padding: [100, 0, 0, 0],
          x: "center",
          y: "bottom",
          data: [this.title],
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            triggerEvent: true,
            axisLabel: {
              margin: 10,
              interval: 0,
              textStyle: {
                color: colors[0],
                //   color: function(param, index) {
                //   return colors[index]
                //  },
              },
              rich: {
                a1: {
                  backgroundColor: {
                    image: require("@/assets/images/my-home/first.png"),
                  },
                  width: 16,
                  height: 14,
                  align: "kef",
                  verticalAlign: "middle",
                },
                a2: {
                  backgroundColor: {
                    image: require("@/assets/images/my-home/second.png"),
                  },
                  width: 16,
                  height: 14,
                  align: "center",
                  verticalAlign: "middle",
                },
                a3: {
                  backgroundColor: {
                    image: require("@/assets/images/my-home/third.png"),
                  },
                  width: 16,
                  height: 14,
                  align: "center",
                  verticalAlign: "middle",
                },
                b: {
                  width: 16,
                  height: 14,
                  // lineHeight: 23,
                  align: "center",
                  verticalAlign: "middle",
                },
              },
              formatter: function (params, index) {
                var leftIndex = index + 1;
                if (leftIndex < 4) {
                  return ["{a" + leftIndex + "|" + "}" + " " + params].join(
                    "\n"
                  );
                } else {
                  return ["{b|" + leftIndex + "}" + " " + params].join("\n");
                }
              },
            },
            data: this.serviceInfo.nameList,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            max: this.serviceInfo.dataList[0].value,
            position: "left",
            axisLine: {
              lineStyle: {
                color: colors[0],
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: this.title,
            type: "bar",
            barWidth: 20,
            data: this.serviceInfo.dataList,
            itemStyle: {
              normal: {
                color: function (params, index) {
                  var colorList = colorsTitle;
                  return colorList[params.dataIndex];
                  // return colors[0];
                },
                //以下为是否显示，显示位置和显示格式的设置了
                label: {
                  show: true,
                  position: "top",
                  formatter: "{c}",
                  //    formatter: '{b}\n{c}'
                },
              },
            },
          },
        ],
      });
      this.chart.on("click", function (params) {
        if (params.componentType == "series") {
          // _this.$emit("toPersonal", valueList[params.dataIndex]);
        } else if (params.componentType == "xAxis") {
          let str = params.event.target.anid;
          let index = str.substr(str.length - 1, 1);
          // _this.$emit("toPersonal", valueList[index]);
        }
      });
    },
  },
};
</script>
