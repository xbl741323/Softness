import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, View, Image, TouchableWithoutFeedback, ScrollView, ImageBackground } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import * as envCofig from "../../../utils/envConfig"

export default function CourseItem({ props, courseInfo }) {

  // 跳转到课程详情
  const toCourseDetail = () => {
    props.navigation.navigate('CourseDetail', { id: courseInfo.id })
  }

  return (
    <TouchableWithoutFeedback onPress={(e) => toCourseDetail(e)} style={styles.tabClassItem}>
      <View style={styles.tabClassItem}>
        {
          courseInfo.trySeeSectionNumber > 0 ? (
            <View style={styles.tabTrySeeContain}>
              <Text style={styles.tabTrySee}>试看</Text>
            </View>
          ) : ''
        }
        {/* 封面区域 */}
        <Image resizeMode='stretch' style={styles.tabClassCover} source={{ uri: envCofig.CDN_BASE_URL + courseInfo.baseCoverUrl }}></Image>
        {/* 标题 */}
        <View style={styles.tabClassRight}>
          <View style={styles.rightTitleContain}>
            {
              courseInfo.tradingChargeType != 1 ? (
                <View style={styles.rightTitleLabel}>
                  {
                    (courseInfo.tradingChargeType == 2) || (courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ?
                      (
                        <View style={styles.labelLeftStyContain}>
                          <Text style={styles.labelLeftSty}>VIP</Text>
                        </View>
                      ) : ''
                  }
                  {courseInfo.tradingChargeType == 2 ?
                    (
                      <View style={styles.labelRightStyContain}>
                        <Text style={styles.labelRightSty}>免费</Text>
                      </View>
                    ) : ''
                  }
                  {(courseInfo.tradingChargeType == 3) && (courseInfo.tradingVipPrice !== 0) ?
                    (
                      <Text style={styles.labelRightSty}>{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingVipPrice + courseInfo.tradingThirdFee) : courseInfo.tradingVipPrice}元</Text>
                    ) : ''
                  }
                </View>
              ) : ''
            }
            <Text style={[styles.classRightTitle, courseInfo.tradingChargeType != 1 ? '' : styles.allFreeTitle]} numberOfLines={1}>{courseInfo.baseTitle}</Text>
          </View>
          {/* 广告语 */}
          <Text style={styles.classRightDesc} numberOfLines={1}>{courseInfo.baseSlogan}</Text>
          {/* 价格 */}
          {
            courseInfo.tradingChargeType != 1 ? (
              <View style={styles.classRightPriceContain}>
                <Text style={styles.classRightPrice}>￥{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingCurrentPrice + courseInfo.tradingThirdFee) : courseInfo.tradingCurrentPrice}元</Text>
                <Text style={styles.classRightGrayPrice}>￥{courseInfo.tradingThirdFeeState == 1 ? (courseInfo.tradingOriginalPrice + courseInfo.tradingThirdFee) : courseInfo.tradingOriginalPrice}元</Text>
              </View>
            ) : (
              <View style={styles.classRightPriceContain}>
                <Text style={styles.classRightPrice}>￥免费</Text>
              </View>
            )
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  tabClassItem: {
    position: 'relative',
    height: dp2px(75),
    marginBottom: dp2px(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabClassCover: {
    width: dp2px(114),
    height: dp2px(75),
    borderRadius: dp2px(4)
  },
  tabClassRight: {
    width: dp2px(205),
    height: dp2px(75),
    marginLeft: dp2px(10),
  },
  classRightTitle: {
    width: dp2px(155),
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginTop: dp2px(2)
  },
  allFreeTitle: {
    width: dp2px(205),
  },
  classRightDesc: {
    color: '#888888',
    fontSize: dp2px(12),
    marginTop: dp2px(10),
    marginBottom: dp2px(10)
  },
  classRightPriceContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  classRightPrice: {
    color: '#FA7A42',
    fontSize: dp2px(14),
    marginRight: dp2px(6),
    fontWeight: 'bold'
  },
  classRightGrayPrice: {
    color: '#888888',
    fontSize: dp2px(12),
    textDecorationLine: 'line-through'
  },
  tabTrySeeContain: {
    width: dp2px(26),
    height: dp2px(15),
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    backgroundColor: '#FA7A42',
    borderTopLeftRadius: dp2px(4),
    borderBottomRightRadius: dp2px(4)
  },
  tabTrySee: {
    color: '#FFFFFF',
    fontSize: dp2px(10),
    lineHeight: dp2px(15),
    textAlign: 'center',
  },
  rightTitleContain: {
    width: dp2px(205),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightTitleLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFCA95',
    borderTopLeftRadius: dp2px(2),
    borderBottomLeftRadius: dp2px(2),
    marginRight: dp2px(4)
  },
  labelLeftStyContain: {
    backgroundColor: '#EFCA95',
    borderTopLeftRadius: dp2px(2),
    borderBottomLeftRadius: dp2px(2)
  },
  labelLeftSty: {
    fontSize: dp2px(10),
    color: '#663E05',
    paddingHorizontal: dp2px(4),
    paddingTop: dp2px(2),
    paddingBottom: dp2px(1),
  },
  labelRightStyContain: {
    backgroundColor: '#663E05',
    borderRadius: dp2px(2)
  },
  labelRightSty: {
    fontSize: dp2px(10),
    color: '#FFFFFF',
    paddingHorizontal: dp2px(4),
    paddingTop: dp2px(2),
    paddingBottom: dp2px(1),
  }
})
