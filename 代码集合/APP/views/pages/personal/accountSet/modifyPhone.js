import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, TextInput, ScrollView, SafeAreaView, TouchableWithoutFeedback } from 'react-native'
import Storage from '../../../utils/common/storage'
import dp2px from '../../../utils/common/dp2px';
import * as CodeMsg from "../../../utils/common/codeMsg";
import { throttle } from '../../../utils/common/utils'
import { useSelector, useDispatch } from 'react-redux'
import { getAccountInfo } from '../../../redux/reducers/userInfo'
import Toast from 'react-native-root-toast'
import MD5 from "react-native-md5";
import {
  checkPassword,
  checkPhoneCode,
  changePhone
} from '../../../api/accountSet'
import { sendcode } from '../../../api/user'
/**
 * 未认证用户-修改手机号
 */
export default function ModifyPhone(props) {
  const dispatch = useDispatch()
  const timer = useRef(null)
  const [codeStatus, setCodeStatus] = useState(false) // 验证码状态
  const [codeCount, setCodeCount] = useState(60) // 验证码倒计时时间
  const [modifyType, setModifyType] = useState(0) // 修改方式 0-手机号修改 1-账号密码修改
  const [passValid, setPassValid] = useState(false) // 是否通过校验 
  const [userInfo, setUserInfo] = useState(null)
  const [validStatus, setValidStatus] = useState(false) // 是否开启校验
  const [newPhoneBlur, setNewPhoneBlur] = useState(false) // 手机号是否通过校验 
  const [formInfo, setFormInfo] = useState({
    code: '',
    codeError: true,
    newPhone: '',
    newPhoneError: true,
    oldPwd: '',
    oldPwdError: true,
  })
  // 获取用户信息
  const getUserData = async () => {
    try {
      const value = await Storage.getItem('userInfo')
      if (value != null) {
        setUserInfo({ ...value })
        console.log(value, '账户设置用户信息')
      }
    } catch (e) {
      // error reading value
    }
  }

  // 手机格式校验
  const checkNewPhone = () => {
    setNewPhoneBlur(true)
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(formInfo.newPhone)) {
      formInfo.newPhoneError = false
      setFormInfo({ ...formInfo })
    } else {
      formInfo.newPhoneError = true
      setFormInfo({ ...formInfo })
    }
  }

  // 原密码必填项校验
  const checkOldPwd = () => {
    setValidStatus(true)
    console.log(formInfo.oldPwd, 'formInfo.oldPwd')
    if (Number(formInfo.oldPwd) != 0) {
      formInfo.oldPwdError = false
      setFormInfo({ ...formInfo })
    } else {
      formInfo.oldPwdError = true
      setFormInfo({ ...formInfo })
    }
  }

  // 验证码必填项校验
  const checkCode = () => {
    setValidStatus(true)
    if (Number(formInfo.code) != 0) {
      formInfo.codeError = false
      setFormInfo({ ...formInfo })
    } else {
      formInfo.codeError = true
      setFormInfo({ ...formInfo })
    }
  }

  // 获取新手机号验证码
  const getNewCode = throttle(() => {
    if (formInfo.newPhoneError) {
      checkNewPhone()
    }
    if (!codeStatus && !formInfo.newPhoneError) {
      getFinalCode(formInfo.newPhone)
    }
  }, 1000)

  // 获取旧手机号验证码
  const getCode = throttle(() => {
    if (!codeStatus) {
      getFinalCode(userInfo.phone)
    }
  }, 1000)

  // 获取验证码
  const getFinalCode = (phone) => {
    sendcode(phone).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        setCodeStatus(true)
        timer.current = setInterval(() => {
          setCodeCount((codeCount) => codeCount - 1)
        }, 1000)
      }
    })
  }

  // 修改密码修改方式
  const changeModifyType = () => {
    setValidStatus(false)
    setModifyType(modifyType == 0 ? 1 : 0)
  }

  // 修改短信验证码值
  const changeCodeInput = (val) => {
    formInfo.code = val.trim()
    setFormInfo({ ...formInfo })
  }

  // 修改原密码值
  const changeOldInput = (val) => {
    formInfo.oldPwd = val.trim()
    setFormInfo({ ...formInfo })
  }

  // 修改新手机号值
  const changeNewPhoneInput = (val) => {
    formInfo.newPhone = val.trim()
    setFormInfo({ ...formInfo })
  }

  // 必填项校验
  const validateForm = throttle(() => {
    modifyType == 0 ? validateCode() : validateOldPwd()
  }, 1000)

  // 校验验证码是否填写
  const validateCode = () => {
    formInfo.codeError ? checkCode() : passCodeValid()
  }

  // 校验原密码是否填写
  const validateOldPwd = () => {
    formInfo.oldPwdError ? checkOldPwd() : passOldPwdValid()
  }

  // 调用接口判断验证码是否正确
  const passCodeValid = () => {
    let params = {
      mobilephone: userInfo.phone,
      authcode: formInfo.code,
    };
    checkPhoneCode(params).then(res => {
      if (res.data.code == CodeMsg.CODE_1000) {
        resetStatus()
      } else {
        Toast.show(res.data.cnMsg, {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
      }
    })
  }

  // 调用接口判断原密码是否正确
  const passOldPwdValid = () => {
    let params = {
      accountId: userInfo.accountId,
      password: MD5.hex_md5(formInfo.oldPwd)
    };
    checkPassword(params).then((res) => {
      console.log(res, 'resres')
      if (res.code == CodeMsg.CODE_0) {
        resetStatus()
      } else {
        Toast.show(res.msg, {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
      }
    });
  }

  // 重置code值
  const resetStatus = () => {
    setPassValid(true)
    setValidStatus(false)
    setCodeStatus(false)
    setCodeCount(60)
    clearInterval(timer.current)
    timer.current = null
    formInfo.code = ''
    formInfo.codeError = true
    setFormInfo({ ...formInfo })
  }

  // 修改手机号码前校验
  const finalValid = throttle(() => {
    if (formInfo.newPhoneError) {
      checkNewPhone()
    }
    if (formInfo.codeError) {
      checkCode()
    }
    if (!formInfo.newPhoneError && !formInfo.codeError) {
      console.log('校验通过')
      passFinalConfirm()
    }
  }, 1000)

  // 修改手机号码前校验
  const passFinalConfirm = () => {
    let params = {
      authCode: formInfo.code,
      mobile: formInfo.newPhone
    };
    changePhone(params).then((res) => {
      if (res.code == CodeMsg.CODE_0) {
        Toast.show('修改成功！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
        dispatch(getAccountInfo())
        setTimeout(() => {
          props.navigation.navigate('Personal')
        }, 500)
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

  useEffect(() => {
    if (codeCount === 0 && timer.current !== null) {
      setCodeStatus(false)
      setCodeCount(60)
      clearInterval(timer.current)
      timer.current = null
    }
  }, [codeCount])

  useFocusEffect(
    React.useCallback(() => {
      getUserData()
    }, [])
  )

  return (
    <SafeAreaView>
      <View style={styles.modifyContain}>
        {passValid ?
          (<View style={styles.modifyForm}>
            <View style={styles.modifyFormItem}>
              <Text style={styles.modifyLabel}>新手机号码：</Text>
              <View style={[styles.codeContain, styles.finalCodeText]}>
                <TextInput value={formInfo.newPhone} onBlur={(e) => checkNewPhone(e)} onChangeText={(e) => changeNewPhoneInput(e)} style={[styles.modifyInput, formInfo.newPhoneError && newPhoneBlur ? styles.formErrorSty : '', styles.finalText]} placeholder='请输入新手机号码'></TextInput>
                {formInfo.newPhoneError && newPhoneBlur ? (<Text style={styles.errorText}>请输入正确的新手机号码</Text>) : ''}
              </View>
            </View>
            <View style={styles.modifyFormItem}>
              <Text style={styles.modifyLabel}>验证码：</Text>
              <View style={[styles.codeContain, styles.finalCodeText]}>
                <TextInput onBlur={(e) => checkCode(e)} value={formInfo.code} maxLength={8} keyboardType="numeric" onChangeText={(e) => changeCodeInput(e)} style={[styles.modifyInput, styles.miniWidth, formInfo.codeError && validStatus ? styles.formErrorSty : '']} placeholder='请输入验证码'></TextInput>
                {formInfo.codeError && validStatus ? (<Text style={styles.errorText}>验证码不能为空</Text>) : ''}
                <TouchableWithoutFeedback onPress={(e) => getNewCode(e)}>
                  <View style={styles.sendBtn}>
                    <Text style={styles.sendBtnText}>{codeStatus ? `${codeCount}s后获取` : '发送验证码'}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
          ) : (<View>
            {
              modifyType == 0 ?
                (
                  <View style={styles.modifyForm}>
                    {
                      userInfo != null ? (
                        <View style={styles.modifyFormItem}>
                          <Text style={styles.modifyLabel}>手机号码：</Text>
                          <TextInput editable={false} value={userInfo.mobile} style={styles.modifyInput} placeholder='请输入账号名'></TextInput>
                        </View>
                      ) : ''
                    }
                    <View style={styles.modifyFormItem}>
                      <Text style={styles.modifyLabel}>验证码：</Text>
                      <View style={styles.codeContain}>
                        <TextInput onBlur={(e) => checkCode(e)} value={formInfo.code} maxLength={8} keyboardType="numeric" onChangeText={(e) => changeCodeInput(e)} style={[styles.modifyInput, styles.smallWidth, formInfo.codeError && validStatus ? styles.formErrorSty : '']} placeholder='请输入验证码'></TextInput>
                        {formInfo.codeError && validStatus ? (<Text style={styles.errorText}>验证码不能为空</Text>) : ''}
                        <TouchableWithoutFeedback onPress={(e) => getCode(e)}>
                          <View style={styles.sendBtn}>
                            <Text style={styles.sendBtnText}>{codeStatus ? `${codeCount}s后获取` : '发送验证码'}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.modifyForm}>
                    {
                      userInfo != null ? (
                        <View style={styles.modifyFormItem}>
                          <Text style={styles.modifyLabel}>账号名：</Text>
                          <TextInput editable={false} value={userInfo.username} style={styles.modifyInput} placeholder='请输入账号名'></TextInput>
                        </View>
                      ) : ''
                    }
                    <View style={styles.modifyFormItem}>
                      <Text style={styles.modifyLabel}>原密码：</Text>
                      <View style={styles.codeContain}>
                        <TextInput value={formInfo.oldPwd} keyboardType="default" autoCapitalize={'none'} secureTextEntry={true} onBlur={(e) => checkOldPwd(e)} onChangeText={(e) => changeOldInput(e)} style={[styles.modifyInput, formInfo.oldPwdError && validStatus ? styles.formErrorSty : '']} placeholder='请输入原登录密码'></TextInput>
                        {formInfo.oldPwdError && validStatus ? (<Text style={styles.errorText}>请输入原登录密码</Text>) : ''}
                      </View>
                    </View>
                  </View>
                )
            }
          </View>)
        }
        {
          passValid ? (
            <View>
              <TouchableWithoutFeedback onPress={(e) => finalValid(e)}>
                <View style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>提交</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <View>
              <TouchableWithoutFeedback onPress={(e) => validateForm(e)}>
                <View style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>下一步</Text>
                </View>
              </TouchableWithoutFeedback>
              {
                !passValid ? (
                  <TouchableWithoutFeedback onPress={(e) => changeModifyType(e)}>
                    <View>
                      <Text style={styles.msgText}>{modifyType == 0 ? '手机号无法使用，通过密码验证方式' : '手机短信验证方式'}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : ''
              }
            </View>
          )
        }
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  modifyContain: {
    backgroundColor: '#ffffff',
    paddingTop: dp2px(32),
    paddingBottom: dp2px(24),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modifyForm: {
    width: Dimensions.get('window').width,
    paddingHorizontal: dp2px(24),
  },
  formErrorSty: {
    borderColor: '#FE3636',
  },
  modifyFormItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp2px(24)
  },
  modifyLabel: {
    color: '#333333',
    fontSize: dp2px(14)
  },
  modifyInput: {
    width: dp2px(247),
    height: dp2px(32),
    paddingVertical: 0,
    paddingLeft: dp2px(10),
    borderColor: '#D6D6D6',
    borderWidth: dp2px(1),
    borderRadius: dp2px(4),
    fontSize: dp2px(12)
  },
  smallWidth: {
    width: dp2px(163)
  },
  miniWidth: {
    width: dp2px(155)
  },
  submitBtn: {
    width: dp2px(327),
    height: dp2px(38),
    backgroundColor: '#36a6fe',
    borderRadius: dp2px(19),
    marginTop: dp2px(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: dp2px(14),
  },
  msgText: {
    width: dp2px(327),
    textAlign: 'right',
    color: '#3DA1FF',
    fontSize: dp2px(12),
    marginTop: dp2px(8)
  },
  sendBtn: {
    width: dp2px(80),
    height: dp2px(32),
    backgroundColor: '#36A6FE',
    borderRadius: dp2px(4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: dp2px(12)
  },
  codeContain: {
    position: 'relative',
    width: dp2px(247),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finalCodeText: {
    width: dp2px(240),
  },
  errorText: {
    position: 'absolute',
    bottom: dp2px(-20),
    fontSize: dp2px(12),
    color: '#FE3636'
  },
  finalText: {
    width: dp2px(240),
  }
})