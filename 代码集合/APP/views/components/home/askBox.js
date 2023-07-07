import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, SafeAreaView, ScrollView, StatusBar, ImageBackground } from 'react-native'
import dp2px from '../../utils/common/dp2px';

export default function AskBox() {
  const [keyList, setKeyList] = useState([
    '高新企业', '专利申请', '软件著作', '商业版权', '知识产权',
  ])

  return (
    <View style={styles.askContain}>
      <View style={styles.askForm}>
        <Image style={styles.askImg} source={require('../../images/home/ask-bg.png')} />
        <View style={styles.askScroll}>
          <View style={styles.askFireContain}>
            <Image style={styles.askFire} source={require('../../images/home/icon-fire.png')} />
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.keyContain}>
              {
                keyList.map((item, index) => {
                  return (
                    <Text key={index} style={styles.keyItem}>{item}</Text>
                  )
                })
              }
            </View>
          </ScrollView>
        </View>
        <View style={styles.keyInputContain}>
          <View style={styles.keyFormContain}>
            <TextInput
              style={styles.keyInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              textAlignVertical='center'
              placeholderTextColor='#B4B4B4'
              placeholder="您的需求 如:高新企业">
            </TextInput>
          </View>
          <View style={styles.keyBtnContain}>
            <Text style={styles.keyBtn}>提交</Text>
          </View>
        </View>
        <Text style={styles.askText}>将为您提供优质的服务顾问</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  /**
  * 咨询框表单
  */
  askContain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    borderTopRightRadius: dp2px(20),
    borderTopLeftRadius: dp2px(20),
    backgroundColor: '#F5F7FB',
    height: dp2px(200),
    marginTop: dp2px(190)
  },
  askForm: {
    position: 'relative',
    marginTop: dp2px(50),
    width: dp2px(351),
    height: dp2px(151),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  askImg: {
    position: 'absolute',
    top: dp2px(-33),
    left: dp2px(15),
    width: dp2px(320),
    height: dp2px(67)
  },
  askScroll: {
    width: dp2px(320),
    height: dp2px(24),
    marginTop: dp2px(45),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  askFireContain: {
    width: dp2px(24),
    height: dp2px(24),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  askFire: {
    width: dp2px(12),
    height: dp2px(12),
  },
  askText: {
    width: dp2px(320),
    fontSize: dp2px(10),
    color: '#BBBBBB',
    textAlign: 'left'
  },
  keyContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dp2px(6)
  },
  keyItem: {
    color: '#36A6FE',
    height: dp2px(20),
    lineHeight: dp2px(20),
    textAlign: 'center',
    borderWidth: dp2px(1),
    borderColor: '#36A6FE',
    borderRadius: dp2px(4),
    paddingHorizontal: dp2px(6),
    marginRight: dp2px(8)
  },
  keyInputContain: {
    width: dp2px(320),
    height: dp2px(32),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: dp2px(14),
    marginBottom: dp2px(9)
  },
  keyFormContain: {
    width: dp2px(224),
    height: dp2px(32),
    backgroundColor: '#F5F7FB',
    borderRadius: dp2px(4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  keyInput: {
    width: dp2px(190),
    color: '#7B7B7B',
    fontSize: dp2px(12),
    padding: 0,
    marginLeft: dp2px(16)
  },
  keyBtnContain: {
    backgroundColor: '#36A6FE',
    borderRadius: dp2px(4)
  },
  keyBtn: {
    width: dp2px(86),
    height: dp2px(32),
    lineHeight: dp2px(32),
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: dp2px(14),
    fontWeight: 'bold'
  }
})
