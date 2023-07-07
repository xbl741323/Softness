import React, { useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { Platform, StyleSheet, Dimensions, ImageBackground, Text, View, Image, SafeAreaView, TouchableWithoutFeedback, ScrollView } from 'react-native'
import dp2px from '../../utils/common/dp2px';
import * as CodeMsg from "../../utils/common/codeMsg";
import * as envCofig from "../../utils/envConfig"
import * as proFilter from "../../utils/filter/product"
import Swiper from 'react-native-swiper'
import { getProDetail, getProductList } from '../../api/product'
import RenderHtml from 'react-native-render-html';
import DeviceInfo from 'react-native-device-info'
import Video from 'react-native-video';

export default function ProDetail(props) {
  const scrollRef = useRef()
  const { route } = props
  const [modelType, setModelType] = useState('')
  const [iosList] = useState(['X', 'Xs', '11', '12', '13', '14'])
  const [proId, setProId] = useState(null) // 产品id
  const [proInfo, setProInfo] = useState({}) // 产品详情数据
  const [tradeInfo, setTradeInfo] = useState({}) // 产品-商品列表信息
  const [skuInfo, setSkuInfo] = useState({}) // 产品-当前规格商品信息
  const [swiperList, setSwiperList] = useState([]) // 产品详情封面数据
  const [tabList, setTabList] = useState([]) // 产品tab内容数据
  const [tabIndex, setTabIndex] = useState(0) // 产品tab初始index
  const [showTab, setShowTab] = useState(false) // 是否显示tab
  const [proList, setProList] = useState([]) // 热门产品数据
  const [skuIndex, setSkuIndex] = useState(null) // 默认商品规格属性skuIndex 例: 0 或 0_0
  const [filterSkuIndex, setFilterSkuIndex] = useState([]) // 默认商品规格属性skuIndex数组 例: [0] 或 [0,1]
  const [skuFilterList, setSkuFilterList] = useState([]) // 所有商品的属性下标集合 例： [[0,1]]或[[0,1],[0,1]]
  const [attributeList, setAttributeList] = useState([]) // 规格属性显示数组
  const [modelStatus, setModelStatus] = useState(false) // 弹窗显示状态
  const [proCount, setProCount] = useState(1) // 产品数量
  const [layOutY, setLayOutY] = useState([]) // 存储tab对应位置高度
  const [layMainOutY, setLayMainOutY] = useState(0) // 存储tab对应位置高度
  const [introList] = useState([
    {
      title: '全程监督',
      imgUrl: require('../../images/classify/icon_supervision.png')
    },
    {
      title: '保障权益',
      imgUrl: require('../../images/classify/icon_equities.png')
    },
    {
      title: '十年行业经验',
      imgUrl: require('../../images/classify/icon_experience.png')
    }
  ])

  // 跳转到首页
  const toHome = () => {
    let navigation = props.navigation
    navigation.navigate('Home')
  }
  // 跳转到产品详情页面
  const toDetail = (item) => {
    let navigation = props.navigation
    let params = {
      id: item.id
    }
    navigation.navigate('ProDetail', params)
  }
  // 获取产品数据
  const getProData = (proInfo) => {
    let params = {
      categoryId: proInfo.categoryId,
      pageNo: 1,
      pageSize: 8,
      status: "1",
      id: proId
    }
    getProductList(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data.records
        setProList([...r])
      }
    })
  }
  // 获取产品详情数据
  const getDetail = () => {
    let params = {
      spuId: proId
    }
    getProDetail(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        console.log(r, 'r')
        setProInfo({ ...r.baseInfo })
        setTradeInfo({ ...r.tradeInfo })
        setSkuIndex(r.tradeInfo.skuList[0].skuIndex)
        setFilterSkuIndex([...proFilter.translateSkuIndex(r.tradeInfo.skuList[0].skuIndex)])
        setSkuInfo(r.tradeInfo.skuList[0])
        setSwiperList([...r.baseInfo.imageList])
        setTabList([...r.detailInfoList])
        setAttributeList([...proFilter.getAttributeList(r.tradeInfo.dynamicAttributeList)])
        setSkuFilterList([...proFilter.filterSkuList(r.tradeInfo.dynamicAttributeList, r.tradeInfo.skuList)])
        getProData(r.baseInfo)
      }
    })
  }
  // 筛选返回地区和归口值
  const filterVal = (type) => {
    if (proInfo.generateAttributeList) {
      let attributeList = proInfo.generateAttributeList
      let r = attributeList.filter(item => {
        return item.attributeId == type
      })
      return r.length > 0 ? r[0].attributeValueDesc : ''
    }
  }
  // 产品id赋值
  const setDefaultVal = () => {
    if (route.params && route.params.id) {
      setProId(route.params.id)
    }
  }
  // 筛选当前规格属性商品信息赋值
  const filterSkuInfo = () => {
    if (tradeInfo.skuList) {
      let r = tradeInfo.skuList.filter(item => {
        return item.skuIndex == skuIndex
      })
      return r.length > 0 ? r[0] : {}
    } else {
      return {}
    }
  }
  // 富文本图片前缀处理
  const filterImg = (val) => {
    if (val) {
      let r = val.replace(/\/\/static.wotao.com/g, "https://static.wotao.com")
      return r
    }
  }

  // 点击立即下单按钮
  const submitOrder = () => {
    if (proInfo.isOnline) {
      setModelStatus(true)
    }
  }

  // 显示遮罩层
  const showModel = () => {
    setModelStatus(true)
  }

  // 隐藏遮罩层
  const hideModel = () => {
    setModelStatus(false)
  }

  // 修改产品数量
  const changeNum = (status) => {
    if (status) {
      if (proCount > 0 && proCount < 99) {
        let val = proCount + 1
        setProCount(val)
      }
    } else {
      if (proCount > 1 && proCount <= 99) {
        let val = proCount - 1
        setProCount(val)
      }
    }
  }

  // 修改属性下标
  const changeSkuIndex = (index, childIndex) => {
    let val = filterSkuIndex
    val[index] = childIndex
    setFilterSkuIndex([...val])
    setSkuIndex(val.join('_'))
  }

  const onScroll = (event) => {
    const offSetY = event.nativeEvent.contentOffset.y;
    offSetY > 500 ? setShowTab(true) : setShowTab(false)
  }

  // 修改tab栏index
  const changeTab = (index) => {
    setTabIndex(index)
    scrollRef.current.scrollTo({ animated: false, y: (layOutY[index] + layMainOutY - 50) });
  }

  // 存储锚点位置
  const showMainScroll = (e) => {
    if (e) {
      setLayMainOutY(e.nativeEvent.layout.y)
    }
  }

  // 存储锚点位置
  const showScroll = (e) => {
    if (e) {
      let arr = layOutY
      arr.push(e.nativeEvent.layout.y)
      setLayOutY([...arr])
    }
  }

  // 监听ios手机型号
  useEffect(() => {
    if (DeviceInfo.getModel() && DeviceInfo.getModel().indexOf('iPhone') != '-1') {
      let arr = DeviceInfo.getModel().slice(7).split(' ')
      setModelType(arr.length > 0 ? arr[0] : '')
    }
  }, [modelType])

  // 监听route钩子函数
  useEffect(() => {
    setSkuInfo(filterSkuInfo())
  }, [filterSkuIndex])

  // 监听route钩子函数
  useEffect(() => {
    setDefaultVal()
    scrollRef.current.scrollTo({ animated: false, y: 0 });
  }, [route])

  // 监听获取产品详情钩子函数
  useEffect(() => {
    if (proId != null) {
      getDetail()
    }
  }, [proId])

  return (
    <SafeAreaView>
      <View style={styles.mainContain}>
        {/* 指定tab栏 */}
        {
          showTab ? <View style={styles.tagList}>
            {
              tabList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={(e) => changeTab(index, e)} style={styles.tagItem}>
                    <View key={index} style={styles.tagItem}>
                      <Text style={[styles.tagNameSty, tabIndex == index ? styles.activeTagNameSty : '']}>{item.tagName}</Text>
                      <Text style={[styles.tagLang, tabIndex == index ? styles.activeTagLang : '']}></Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View> : ''
        }
        <ScrollView ref={scrollRef} onScroll={(e) => onScroll(e)} showsVerticalScrollIndicator={false} scrollEventThrottle={0}>
          <View style={styles.proContain}>
            <View style={styles.probg}>
              {/* 背景图 */}
              <View style={styles.swiperContain}>
                <Swiper
                  horizontal={true}
                  key={swiperList.length}
                  loop={true}
                  showsButtons={false}
                  autoplay={false}>
                  {
                    swiperList.map((item, index) => {
                      return (
                        item.mediaUrl && item.mediaUrl != '' ?
                          <Video
                            key={index}
                            ignoreSilentSwitch="ignore"
                            paused={true}
                            autoplay={false}
                            posterResizeMode='contain'
                            resizeMode='contain'
                            poster={envCofig.CDN_BASE_URL + item.mediaUrl}
                            controls={true}
                            style={styles.proVideo}
                            source={{ uri: envCofig.CDN_BASE_URL + item.imageUrl }}>
                          </Video>
                          : <Image key={index} resizeMode='stretch' style={styles.proImage} source={{ uri: envCofig.CDN_BASE_URL + item.imageUrl }} />)
                    })
                  }
                </Swiper>
              </View>
              {/* 价格+区域归口展示 */}
              <ImageBackground style={styles.proPriceContain} source={require('../../images/classify/price-bg.png')}>
                <View style={styles.priceLeftContain}>
                  {
                    proInfo.isOnline ? (
                      (skuInfo.skuPayTypeList) && (skuInfo.skuPayTypeList.dueTypeAgencyFee || skuInfo.skuPayTypeList.dueTypeThirdPartyFee) ? (
                        // 一次性付款方式
                        <View style={styles.fixPriceItem}>
                          <Text style={styles.fixPriceItemLabel}>服务费</Text>
                          <View style={styles.fixPriceItemVal}>
                            <Text style={styles.fixPriceLabel}>￥</Text>
                            <Text style={styles.fixPriceVal}>{proFilter.filterOnePrice(skuInfo.skuPayTypeList)}</Text>
                          </View>
                        </View>) : (
                        // 定金尾款方式
                        <View style={styles.fixPriceList}>
                          <View style={styles.fixPriceItem}>
                            <Text style={styles.fixPriceItemLabel}>定金</Text>
                            <View style={styles.fixPriceItemVal}>
                              <Text style={styles.fixPriceLabel}>￥</Text>
                              <Text style={styles.fixPriceVal}>{proFilter.filterdepositPrice(skuInfo.skuPayTypeList)}</Text>
                            </View>
                          </View>
                          <View style={styles.fixPriceItem}>
                            <Text style={styles.fixPriceItemLabel}>尾款</Text>
                            <View style={styles.fixPriceItemVal}>
                              <Text style={styles.fixPriceLabel}>￥</Text>
                              <Text style={styles.fixPriceVal}>{proFilter.filterfinalPrice(skuInfo.skuPayTypeList)}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    ) : (
                      <View style={styles.fixPriceItem}>
                        <Text style={styles.fixPriceItemLabel}>服务费</Text>
                        <View style={styles.fixPriceItemVal}>
                          <Text style={styles.fixPriceLabel}>￥</Text>
                          <Text style={styles.fixPriceVal}>面议</Text>
                        </View>
                      </View>
                    )
                  }
                </View>
                <View style={styles.priceRightContain}>
                  <View style={styles.areaItem}>
                    <Text style={styles.areaText}>地区</Text>
                    <Text style={styles.areaText} numberOfLines={1}>{filterVal(1) || '-'}</Text>
                  </View>
                  <Text style={styles.langText}></Text>
                  <View style={styles.areaItem}>
                    <Text style={styles.areaText}>归口</Text>
                    <Text style={styles.areaText} numberOfLines={1}>{filterVal(2) || '-'}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            {/* 产品标题描述信息 */}
            <View style={styles.proInfoContain}>
              <Text style={styles.proTitle}>{proInfo.spuTitle}</Text>
              <Text style={styles.proDesc}>{proInfo.spuSlogan}</Text>
              <View style={styles.introContain}>
                {
                  introList.map((item, index) => {
                    return (
                      <View key={index} style={styles.introItem}>
                        <Image resizeMode='contain' style={styles.introImg} source={item.imgUrl}></Image>
                        <Text style={styles.introText}>{item.title}</Text>
                      </View>
                    )
                  })
                }
              </View>
            </View>
            {/* 官费规格信息 */}
            <View style={styles.govermentContain}>
              {
                (skuInfo.skuPayTypeList) && (skuInfo.skuPayTypeList.depositTypeOfficialFee || skuInfo.skuPayTypeList.dueTypeOfficialFee) ? (
                  <TouchableWithoutFeedback onPress={(e) => showModel(e)}>
                    <View style={styles.govermentItem}>
                      <Text style={styles.govermentItemLabel}>官费</Text>
                      <View style={styles.goverContain}>
                        <Text style={styles.goverContainPrice}>￥{skuInfo.skuPayTypeList.depositTypeOfficialFee ? proFilter.fixClassPrice(skuInfo.skuPayTypeList.depositTypeOfficialFee) : proFilter.fixClassPrice(skuInfo.skuPayTypeList.dueTypeOfficialFee)}元</Text>
                        <Text style={styles.pointerContain}></Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : ''
              }
              {
                (skuInfo.skuPayTypeList) && (skuInfo.skuPayTypeList.depositTypeOfficialFee || skuInfo.skuPayTypeList.dueTypeOfficialFee) ? <Text style={styles.govermentLang}></Text> : ''
              }
              <TouchableWithoutFeedback onPress={(e) => showModel(e)}>
                <View style={styles.govermentItem}>
                  <Text style={styles.govermentItemLabel}>规格</Text>
                  <View style={styles.goverContain}>
                    <Text style={styles.defaultSty}>{proFilter.getAttributeLabel(attributeList, skuIndex)}</Text>
                    <Text style={styles.pointerContain}></Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
            {/* 广告图片 */}
            <Image style={styles.askImg} resizeMode='stretch' source={require('../../images/classify/pro-banner.png')}></Image>
            {/* 产品tab内容信息 */}
            <View style={styles.tabContain} onLayout={(e) => showMainScroll(e)}>
              {
                tabList.map((item, index) => {
                  return (
                    <View key={index} sty={styles.tabItem} onLayout={(e) => showScroll(e)}>
                      <View style={styles.tabTextContain}>
                        <View style={styles.circleSty}></View>
                        <Text style={styles.tabName}>{item.tagName}</Text>
                      </View>
                      <RenderHtml
                        contentWidth={Dimensions.get('window').width - dp2px(24)}
                        imagesMaxWidth={Dimensions.get('window').width}
                        source={{ html: filterImg(item.text) }}
                        tagsStyles={{
                          p: {
                            margin: 0,
                          },
                          span: {
                            marginBottom: 5
                          }
                        }}
                      />
                    </View>
                  )
                })
              }
            </View>
            {/* 热门产品 */}
            <View styles={styles.hotProContain}>
              <View style={styles.tabTextContain}>
                <View style={styles.circleSty}></View>
                <Text style={styles.tabName}>热门产品</Text>
              </View>
              <View style={styles.proList}>
                {
                  proList.map((item, index) => {
                    return (
                      <TouchableWithoutFeedback onPress={(e) => toDetail(item, e)} key={index}>
                        <View style={styles.proItem}>
                          <Image resizeMode='contain' style={styles.proCover} source={{ uri: envCofig.CDN_BASE_URL + item.imageUrl }}></Image>
                          <Text numberOfLines={1} style={styles.proItemTitle}>{item.spuTitle}</Text>
                          <Text numberOfLines={1} style={styles.proItemDesc}>{item.spuSlogan}</Text>
                          {
                            item.isOnline ? (
                              <Text numberOfLines={1} style={styles.proItemPrice}>
                                <Text>
                                  ￥{proFilter.fixClassPrice(item.spuMinAmount)}元
                                </Text>
                                <Text>
                                  {
                                    proFilter.fixClassPrice(item.spuMinAmount) != proFilter.fixClassPrice(item.spuMaxAmount) ? '起' : ''
                                  }
                                </Text>
                              </Text>
                            ) : (<Text numberOfLines={1} style={styles.proItemPrice}>
                              面议
                            </Text>)
                          }
                        </View>
                      </TouchableWithoutFeedback>
                    )
                  })
                }
              </View>
            </View>
          </View>
        </ScrollView>
        {/* 按钮区域 */}
        <View style={[styles.btnContain, Platform.OS == 'ios' ? {
          alignItems: 'flex-start',
          height: dp2px(iosList.includes(modelType) ? 65 : 60),
          bottom: dp2px(iosList.includes(modelType) ? -30 : 0),
          paddingTop: dp2px(8)
        } : '']}>
          <View style={[styles.btnLeftContain, Platform.OS == 'ios' ? styles.iosBtnLeftContain : '']}>
            <TouchableWithoutFeedback onPress={(e) => toHome(e)} style={styles.btnLeftItem}>
              <View style={styles.btnLeftItem}>
                <Image resizeMode='contain' style={styles.btnLeftImg} source={require('../../images/classify/icon-home.png')}></Image>
                <Text style={styles.btnLeftText}>首页</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback style={styles.btnLeftItem}>
              <View style={styles.btnLeftItem}>
                <Image resizeMode='contain' style={styles.btnLeftImg} source={require('../../images/classify/icon-ask.png')}></Image>
                <Text style={styles.btnLeftText}>客服</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.btnRightContain}>
            <View style={[styles.btnRightItem, styles.lightBg]}>
              <Text style={styles.btnRightText}>加入收藏</Text>
            </View>
            <TouchableWithoutFeedback onPress={(e) => submitOrder(e)} style={[styles.btnRightItem, styles.strongBg]}>
              <View style={[styles.btnRightItem, styles.strongBg]}>
                <Text style={styles.btnRightText}>{proInfo.isOnline ? '立即下单' : '立即咨询'}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {/* 立即下单弹窗遮罩层 */}
        {
          modelStatus == true ? (
            <TouchableWithoutFeedback onPress={(e) => hideModel(e)}>
              <View style={styles.shadowContain}></View>
            </TouchableWithoutFeedback>
          ) : ''
        }
        {/* 立即下单弹窗 */}
        {
          modelStatus == true ? (
            <View style={[styles.modelContain, Platform.OS == 'ios' ? {
              bottom: dp2px(iosList.includes(modelType) ? 40 : 49),
            } : '']}>
              {/* 图片价格显示 */}
              <View style={styles.modelTop}>
                {
                  swiperList.map((item, index) => {
                    return (
                      item.isDefault ? (
                        <Image key={index} resizeMode='stretch' style={styles.modelImg} source={{ uri: envCofig.CDN_BASE_URL + item.imageUrl }} />
                      ) : ''
                    )
                  })
                }
                {
                  proInfo.isOnline ? (
                    (skuInfo.skuPayTypeList) && (skuInfo.skuPayTypeList.dueTypeAgencyFee || skuInfo.skuPayTypeList.dueTypeThirdPartyFee || skuInfo.skuPayTypeList.dueTypeOfficialFee) ? (
                      <View style={styles.modelTopList}>
                        <View style={styles.modelTopItem}>
                          <Text style={styles.modelTopItemLabel}>服务费</Text>
                          <Text style={styles.modelTopItemValue}>￥{proFilter.filterOnePrice(skuInfo.skuPayTypeList)}</Text>
                        </View>
                        {
                          skuInfo.skuPayTypeList.dueTypeOfficialFee ? (
                            <View style={styles.modelTopItem}>
                              <Text style={styles.modelTopItemLabel}>官费</Text>
                              <Text style={styles.modelTopItemValue}>￥{proFilter.fixClassPrice(skuInfo.skuPayTypeList.dueTypeOfficialFee)}</Text>
                            </View>
                          ) : ''
                        }
                      </View>
                    ) : (
                      <View style={styles.modelTopList}>
                        <View style={styles.modelTopItem}>
                          <Text style={styles.modelTopItemLabel}>定金</Text>
                          <Text style={styles.modelTopItemValue}>￥{proFilter.filterdepositPrice(skuInfo.skuPayTypeList)}</Text>
                        </View>
                        <View style={styles.modelTopItem}>
                          <Text style={styles.modelTopItemLabel}>尾款</Text>
                          <Text style={styles.modelTopItemValue}>￥{proFilter.filterfinalPrice(skuInfo.skuPayTypeList)}</Text>
                        </View>
                        {
                          skuInfo.skuPayTypeList.depositTypeOfficialFee ? (
                            <View style={styles.modelTopItem}>
                              <Text style={styles.modelTopItemLabel}>官费</Text>
                              <Text style={styles.modelTopItemValue}>￥{proFilter.fixClassPrice(skuInfo.skuPayTypeList.depositTypeOfficialFee)}</Text>
                            </View>
                          ) : ''
                        }
                      </View>
                    )
                  ) : <View style={styles.modelTopList}>
                    <View style={styles.modelTopItem}>
                      <Text style={styles.modelTopItemLabel}>服务费</Text>
                      <Text style={styles.modelTopItemValue}>面议</Text>
                    </View>
                  </View>
                }

              </View>
              {/* 属性数组显示 */}
              <View style={styles.modelCenter}>
                {
                  tradeInfo.dynamicAttributeList ? (
                    tradeInfo.dynamicAttributeList.map((item, index) => {
                      return (
                        <View key={index} style={styles.modelCenterItem}>
                          <Text style={styles.modelCenterItemLabel}>{Object.keys(item)}</Text>
                          <View style={styles.modelCenterItemContain}>
                            {
                              attributeList[index].map((childItem, childIndex) => {
                                return (
                                  skuFilterList[index].includes(childIndex) ?
                                    <Text
                                      onPress={(e) => changeSkuIndex(index, childIndex, e)}
                                      key={childIndex}
                                      style={[styles.modelCenterItemContainVal, filterSkuIndex[index] == childIndex ? styles.activeCenterItemValue : '']}>
                                      {childItem}
                                    </Text> : ''
                                )
                              })
                            }
                          </View>
                        </View>
                      )
                    })
                  ) : ''
                }
              </View>
              {/* 选择数量 */}
              <View style={styles.modelFoot}>
                <Text style={styles.modelFootLabel}>数量选择</Text>
                <View style={styles.modelFootCount}>
                  <Text onPress={(e) => changeNum(false, e)} style={styles.countReduce}>-</Text>
                  <Text style={styles.countVal}>{proCount}</Text>
                  <Text onPress={(e) => changeNum(true, e)} style={styles.countAdd}>+</Text>
                </View>
              </View>
            </View>
          ) : ''
        }
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContain: {
    position: 'relative',
  },
  tagList: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: dp2px(45),
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999
  },
  tagItem: {
    height: dp2px(45),
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagNameSty: {
    color: '#888888',
    fontSize: dp2px(13)
  },
  activeTagNameSty: {
    color: '#36A6FE'
  },
  tagLang: {
    position: 'absolute',
    bottom: 0,
    width: dp2px(26),
    height: dp2px(4),
    backgroundColor: '#ffffff'
  },
  activeTagLang: {
    backgroundColor: '#36A6FE'
  },
  proContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: dp2px(53)
  },
  probg: {
    position: 'relative',
    height: dp2px(270)
  },
  swiperContain: {
    width: Dimensions.get('window').width,
    height: dp2px(220)
  },
  proImage: {
    width: Dimensions.get('window').width,
    height: dp2px(220)
  },
  proVideo: {
    width: Dimensions.get('window').width,
    height: dp2px(220),
    backgroundColor: '#000000'
  },
  proPriceContain: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: dp2px(63),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLeftContain: {
    width: dp2px(247),
    height: dp2px(63),
    paddingHorizontal: dp2px(13)
  },
  fixPriceList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fixPriceItem: {
    flex: 1,
    height: dp2px(63),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  fixPriceItemLabel: {
    color: '#FFFFFF',
    fontSize: dp2px(10),
    marginBottom: dp2px(2)
  },
  fixPriceItemVal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fixPriceLabel: {
    color: '#FFFFFF',
    fontSize: dp2px(13)
  },
  fixPriceVal: {
    color: '#FFFFFF',
    fontSize: dp2px(19)
  },
  priceRightContain: {
    marginTop: 6,
    width: dp2px(126),
    height: dp2px(63),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  langText: {
    width: dp2px(1),
    height: dp2px(24),
    backgroundColor: '#588AFF'
  },
  areaItem: {
    width: dp2px(60),
    height: dp2px(26),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  areaText: {
    fontSize: dp2px(10),
    color: '#2A63EA'
  },
  proInfoContain: {
    marginTop: dp2px(16),
    borderRadius: dp2px(8),
    width: dp2px(351),
    backgroundColor: '#FFFFFF',
    padding: dp2px(12),
  },
  proTitle: {
    color: '#333333',
    fontSize: dp2px(12),
    fontWeight: 'bold',
    marginBottom: dp2px(8)
  },
  proDesc: {
    color: '#B7B4B4',
    fontSize: dp2px(12),
  },
  introContain: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp2px(20),
    marginBottom: dp2px(8)
  },
  introItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  introImg: {
    width: dp2px(12),
    height: dp2px(12),
    marginRight: dp2px(4)
  },
  introText: {
    color: '#555555',
    fontSize: dp2px(10)
  },
  govermentContain: {
    marginTop: dp2px(12),
    borderRadius: dp2px(8),
    width: dp2px(351),
    backgroundColor: '#FFFFFF',
    padding: dp2px(12),
    paddingVertical: dp2px(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  govermentItem: {
    width: dp2px(327),
    height: dp2px(30),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  govermentItemLabel: {
    color: '#B7B4B4',
    fontSize: dp2px(13)
  },
  govermentLang: {
    width: dp2px(309),
    height: dp2px(1),
    backgroundColor: '#F5F7FB',
    marginTop: dp2px(5),
    marginBottom: dp2px(5)
  },
  goverContain: {
    width: dp2px(300),
    height: dp2px(30),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: dp2px(13)
  },
  goverContainPrice: {
    color: '#FA7A42',
    fontSize: dp2px(13),
    fontWeight: 'bold'
  },
  pointerContain: {
    width: dp2px(9),
    height: dp2px(9),
    borderTopWidth: dp2px(1),
    borderRightWidth: dp2px(1),
    borderColor: 'rgba(51,51,51,0.90)',
    transform: [{
      rotate: '45deg'
    }]
  },
  defaultSty: {
    color: '#555555',
    fontSize: dp2px(14),
    fontWeight: '400'
  },
  askImg: {
    width: dp2px(351),
    height: dp2px(75),
    marginVertical: dp2px(12)
  },
  tabContain: {
    width: Dimensions.get('window').width,
    paddingHorizontal: dp2px(12),
    paddingBottom: dp2px(16),
    paddingTop: dp2px(4),
    backgroundColor: '#FFFFFF'
  },
  tabItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabTextContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: dp2px(12)
  },
  circleSty: {
    width: dp2px(12),
    height: dp2px(12),
    backgroundColor: '#418eff',
    borderRadius: dp2px(12),
    marginRight: dp2px(4)
  },
  tabName: {
    color: '#333333',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  proList: {
    width: dp2px(351),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  proItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: dp2px(173),
    backgroundColor: '#ffffff',
    paddingBottom: dp2px(10),
    borderRadius: dp2px(10),
    marginBottom: dp2px(10)
  },
  proCover: {
    marginTop: dp2px(6),
    width: dp2px(161),
    height: dp2px(113),
    borderTopLeftRadius: dp2px(10),
    borderTopRightRadius: dp2px(10),
    marginBottom: dp2px(6)
  },
  proItemTitle: {
    width: dp2px(161),
    color: '#555555',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginBottom: dp2px(4)
  },
  proItemDesc: {
    width: dp2px(161),
    color: '#B7B4B4',
    fontSize: dp2px(12),
    marginBottom: dp2px(10)
  },
  proItemPrice: {
    width: dp2px(161),
    color: '#FA7A42',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  btnContain: {
    width: Dimensions.get('window').width,
    height: dp2px(49),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: dp2px(12),
    borderTopWidth: dp2px(1),
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  btnLeftContain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: dp2px(4)
  },
  iosBtnLeftContain: {
    alignItems: 'flex-start',
  },
  btnLeftItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnLeftImg: {
    width: dp2px(19),
    height: dp2px(19),
    marginBottom: dp2px(3)
  },
  btnLeftText: {
    color: '#555555',
    fontSize: dp2px(13)
  },
  btnRightContain: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp2px(4)
  },
  btnRightItem: {
    height: dp2px(35),
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0082FC',
  },
  lightBg: {
    backgroundColor: '#3DA1FF',
    borderTopLeftRadius: dp2px(18),
    borderBottomLeftRadius: dp2px(18)
  },
  strongBg: {
    backgroundColor: '#0082FC',
    borderTopRightRadius: dp2px(18),
    borderBottomRightRadius: dp2px(18)
  },
  btnRightText: {
    color: '#FFFFFF',
    fontSize: dp2px(12)
  },
  shadowContain: {
    position: 'absolute',
    bottom: dp2px(49),
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  modelContain: {
    position: 'absolute',
    bottom: dp2px(49),
    left: 0,
    width: Dimensions.get('window').width,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: dp2px(10),
    borderTopRightRadius: dp2px(10),
    paddingVertical: dp2px(16),
    paddingHorizontal: dp2px(12),
    zIndex: 999
  },
  modelTop: {
    height: dp2px(86),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dp2px(20)
  },
  modelTopList: {
    width: dp2px(220),
    height: dp2px(86),
  },
  modelTopItem: {
    height: dp2px(25),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelTopItemLabel: {
    width: dp2px(40),
    color: '#555555',
    fontSize: dp2px(12),
    marginRight: dp2px(4),
    textAlign: 'right'
  },
  modelTopItemValue: {
    color: '#FA7A42',
    fontSize: dp2px(14)
  },
  modelImg: {
    width: dp2px(121),
    height: dp2px(86),
    borderRadius: dp2px(7)
  },
  modelCenter: {
    marginBottom: dp2px(10)
  },
  modelCenterItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  modelCenterItemLabel: {
    color: '#555555',
    fontSize: dp2px(14),
    fontWeight: 'bold',
    marginBottom: dp2px(8)
  },
  modelCenterItemContain: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  modelCenterItemContainVal: {
    height: dp2px(30),
    backgroundColor: '#F8F8F8',
    color: '#B7B4B4',
    textAlign: 'center',
    paddingHorizontal: dp2px(15),
    borderRadius: dp2px(4),
    lineHeight: dp2px(30),
    marginRight: dp2px(6),
    marginBottom: dp2px(10)
  },
  activeCenterItemValue: {
    backgroundColor: '#EFF7FF',
    color: '#0082FC',
    fontWeight: 'bold'
  },
  modelFoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modelFootLabel: {
    color: '#555555',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  },
  modelFootCount: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  countReduce: {
    color: '#000000',
    fontSize: dp2px(20)
  },
  countVal: {
    width: dp2px(30),
    height: dp2px(30),
    backgroundColor: '#eff7ff',
    borderRadius: dp2px(4),
    lineHeight: dp2px(30),
    textAlign: 'center',
    marginHorizontal: dp2px(15),
    color: '#0082FC',
    fontSize: dp2px(14)
  },
  countAdd: {
    color: '#000000',
    fontSize: dp2px(20)
  },
})
