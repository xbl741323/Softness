import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Dimensions, Text, View, TextInput, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import Storage from '../../../utils/common/storage'
import * as envCofig from "../../../utils/envConfig"
import * as CodeMsg from "../../../utils/common/codeMsg";
import { throttle } from '../../../utils/common/utils'
import Toast from 'react-native-root-toast'
import {
  modPerson,
  modCompany
} from '../../../api/accountSet'
/**
 * 修改授权人信息
 */
export default function ModifyAuthInfo() {

  const [userInfo, setUserInfo] = useState(null)
  const [radioIndex, setRadioIndex] = useState(0)
  const [radioList, setRadioList] = useState([
    {
      title: '法人授权认证（实时）',
      value: 3
    },
    {
      title: '对公打款认证（3个工作日之内）',
      value: 1
    },
    {
      title: '纸质材料认证',
      value: 2
    },
  ])
  // 单位认证用户
  const [personForm, setPersonForm] = useState({
    name: '', // 姓名
    nameError: true,
    nameBlur: false,
    idCard: '', // 身份证号码
    idCardError: true,
    idCardBlur: false,
    phone: '', // 手机号码
    phoneError: true,
    phoneBlur: false
  })
  // 个人认证用户
  const [unitForm, setUnitForm] = useState({
    authType: '', // 认证方式
    unitName: '', // 单位名称
    creditCode: '',// 统一信用码
    phone: '', // 手机号码
    phoneError: true,
    phoneBlur: false
  })

  // 修改认证方式
  const changeAuthType = (index) => {
    setRadioIndex(index)
  }

  // 修改个人认证授权信息
  const changePersonInput = (index, val) => {
    let r = val.trim()
    switch (index) {
      case 1: personForm.name = r
        break
      case 2: personForm.idCard = r
        break
      case 3: personForm.phone = r
        break
    }
    setPersonForm({ ...personForm })
  }

  // 修改单位认证授权信息
  const changeUnitInput = (index, val) => {
    let r = val.trim()
    switch (index) {
      case 3: unitForm.phone = r
        break
    }
    setUnitForm({ ...unitForm })
  }

  // 个人手机号blur校验
  const checkPersonPhone = () => {
    personForm.phoneBlur = true
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(personForm.phone)) {
      personForm.phoneError = false
      setPersonForm({ ...personForm })
    } else {
      personForm.phoneError = true
      setPersonForm({ ...personForm })
    }
  }

  // 个人姓名blur校验
  const checkPersonName = () => {
    personForm.nameBlur = true
    let reg = /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/
    if (Number(personForm.name) != 0 && reg.test(personForm.name)) {
      personForm.nameError = false
      setPersonForm({ ...personForm })
    } else {
      personForm.nameError = true
      setPersonForm({ ...personForm })
    }
  }

  // 单位手机号blur校验
  const checkUnitPhone = () => {
    unitForm.phoneBlur = true
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(unitForm.phone)) {
      unitForm.phoneError = false
      setPersonForm({ ...unitForm })
    } else {
      unitForm.phoneError = true
      setPersonForm({ ...unitForm })
    }
  }

  // 提交前校验
  const submitValid = throttle(() => {
    userInfo.userType == 2 ? unitValid() : personValid()
  }, 1000)

  // 个人认证用户校验
  const personValid = () => {
    if (personForm.nameError) {
      checkPersonName()
    }
    if (personForm.phoneError) {
      checkPersonPhone()
    }
    if (!personForm.nameError && !personForm.phoneError) {
      passPersonValid()
    }
  }

  // 单位认证用户校验
  const unitValid = () => {
    if (unitForm.phoneError) {
      checkUnitPhone()
    }
    if (!unitForm.phoneError) {
      passUnitValid()
    }
  }

  // 调用个人认证授权人修改接口
  const passPersonValid = () => {
    let params = {
      autClient: 4,
      idCardName: personForm.name
    }
    modPerson(params).then(res => {
      console.log(res)
      if (res.code == CodeMsg.CODE_0) {
        console.log('操作成功!')
      } else {
        Toast.show(res.msg, {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
      }
    })
  }

  // 调用单位认证授权人修改接口
  const passUnitValid = () => {
    let params = {
      autClient: 4,
      verifiedWay: radioList[radioIndex].value,
      mobile: unitForm.phone
    };
    modCompany(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        console.log('操作成功!')
      } else {
        Toast.show(res.msg, {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
      }
    })
  }

  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '用户信息')
      }
    } catch (e) {
      // error reading value
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      getUserData()
    }, [])
  )

  return (
    <SafeAreaView>
      <View style={styles.authContain}>
        {
          userInfo != null ?
            (userInfo.userType == 2 ?
              (
                <View style={styles.unitContain}>
                  <View style={[styles.formItem, styles.formAuthItem]}>
                    <Text style={styles.formItemText}>认证方式：</Text>
                    <View style={styles.authListContain}>
                      {
                        radioList.map((item, index) => {
                          return (
                            <TouchableWithoutFeedback key={index} onPress={(e) => changeAuthType(index, e)}>
                              <View style={styles.authItemContain}>
                                <View style={[styles.defaultRadio, radioIndex == index ? styles.activeRadio : '']}>
                                  <Text style={[styles.defaultInnerRadio, radioIndex == index ? styles.activeInnerRadio : '']}></Text>
                                </View>
                                <Text style={styles.authTitle}>{item.title}</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          )
                        })
                      }
                    </View>
                  </View>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>单位名称：</Text>
                    <TextInput value={userInfo.orgName} editable={false} style={styles.formItemInput} placeholder='请填写单位名称'></TextInput>
                  </View>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>统一信用代码：</Text>
                    <TextInput value={userInfo.creditCode} editable={false} style={styles.formItemInput} placeholder='请填写统一信用代码'></TextInput>
                  </View>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>手机号码：</Text>
                    <View style={styles.personInputContain}>
                      <TextInput value={unitForm.phone} onBlur={(e) => checkUnitPhone(e)} onChangeText={(e) => changeUnitInput(3, e)} style={[styles.formItemInput, unitForm.phoneError && unitForm.phoneBlur ? styles.formErrorSty : '']} keyboardType="numeric" placeholder='请填写手机号码'></TextInput>
                      {unitForm.phoneError && unitForm.phoneBlur ? (<Text style={styles.errorText}>请输入正确的新手机号码</Text>) : ''}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.personContain}>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>姓名：</Text>
                    <View style={styles.personInputContain}>
                      <TextInput value={personForm.name} onBlur={(e) => checkPersonName(e)} onChangeText={(e) => changePersonInput(1, e)} style={[styles.formItemInput, styles.longInput, personForm.nameError && personForm.nameBlur ? styles.formErrorSty : '']} placeholder='请填写与身份证号码一致的姓名'></TextInput>
                      {personForm.nameError && personForm.nameBlur ? (<Text style={styles.errorText}>请输入正确的姓名</Text>) : ''}
                    </View>
                  </View>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>身份证号：</Text>
                    <TextInput value={userInfo.idCard} onChangeText={(e) => changePersonInput(2, e)} editable={false} style={[styles.formItemInput, styles.longInput]} placeholder='请填写统一信用代码'></TextInput>
                  </View>
                  <View style={styles.formItem}>
                    <Text style={styles.formItemText}>手机号码：</Text>
                    <View style={styles.personInputContain}>
                      <TextInput value={personForm.phone} onBlur={(e) => checkPersonPhone(e)} onChangeText={(e) => changePersonInput(3, e)} style={[styles.formItemInput, styles.longInput, personForm.phoneError && personForm.phoneBlur ? styles.formErrorSty : '']} keyboardType="numeric" placeholder='请填写手机号码'></TextInput>
                      {personForm.phoneError && personForm.phoneBlur ? (<Text style={styles.errorText}>请输入正确的新手机号码</Text>) : ''}
                    </View>
                  </View>
                </View>
              )
            ) : ''
        }
        {/* 提交按钮 */}
        <View>
          <TouchableWithoutFeedback onPress={(e) => submitValid(e)}>
            <Text style={styles.submitBtn}>提 交</Text>
          </TouchableWithoutFeedback>
          <Text style={styles.tipText}>
            请填写真实完善的信息，认证资料审核通过后将与您的账号进行绑定且不可修改
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  authContain: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: dp2px(30),
    paddingBottom: dp2px(30),
  },
  unitContain: {
    display: 'flex'
  },
  personContain: {
    display: 'flex'
  },
  authListContain: {
    width: dp2px(225),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  authItemContain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dp2px(20)
  },
  defaultRadio: {
    width: dp2px(16),
    height: dp2px(16),
    borderRadius: dp2px(16),
    borderWidth: dp2px(1),
    borderColor: '#D9D9D9',
    marginRight: dp2px(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeRadio: {
    borderColor: '#51AEF6',
  },
  defaultInnerRadio: {
    width: dp2px(12),
    height: dp2px(12),
    borderRadius: dp2px(12),
    backgroundColor: '#ffffff',
  },
  activeInnerRadio: {
    backgroundColor: '#51AEF6',
  },
  authTitle: {
    color: '#555555',
    fontSize: dp2px(12)
  },
  formItem: {
    width: dp2px(327),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp2px(24)
  },
  formAuthItem: {
    alignItems: 'flex-start',
    marginBottom: dp2px(10)
  },
  formItemText: {
    color: '#333333',
    fontSize: dp2px(14)
  },
  formItemInput: {
    paddingVertical: 0,
    width: dp2px(225),
    height: dp2px(32),
    borderWidth: dp2px(1),
    borderColor: '#D6D6D6',
    borderRadius: dp2px(4),
    paddingLeft: dp2px(10),
    color: '#BABABA'
  },
  formErrorSty: {
    borderColor: '#FE3636',
  },
  longInput: {
    width: dp2px(241),
  },
  personInputContain: {
    position: 'relative'
  },
  submitBtn: {
    width: dp2px(327),
    height: dp2px(38),
    backgroundColor: '#36a6fe',
    borderRadius: dp2px(19),
    lineHeight: dp2px(38),
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: dp2px(14),
    marginTop: dp2px(8)
  },
  tipText: {
    marginTop: dp2px(8),
    width: dp2px(327),
    textAlign: 'center',
    color: '#D9D9D9',
    fontSize: dp2px(12)
  },
  errorText: {
    position: 'absolute',
    bottom: dp2px(-20),
    fontSize: dp2px(12),
    color: '#FE3636'
  },
})