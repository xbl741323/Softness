import { goWechat } from "@/api/policySquare";
import { Dialog } from 'vant';

// 手机端跳转微信小程序统一处理
export function toWx() {
  Dialog.confirm({
    title: `即将打开“卧涛商城”小程序`,
    confirmButtonText:'允许',
    confirmButtonColor:'#36a6fe'
  }).then(() => {
    goWechat().then(res => {
      if (res.code == 0) {
       location.href = res.data
      }
    })
  }).catch(() => {
  // on cancel
  });
}