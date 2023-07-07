import { Dimensions } from "react-native";
const deviceWidthDp = Dimensions.get("window").width;
// 默认设计稿375
const uiWidthPx = 375;
function dp2px(uiElementPx) {
  return (uiElementPx * deviceWidthDp) / uiWidthPx;
}
export default dp2px;