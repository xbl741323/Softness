import React, { useState, useEffect, useRef } from 'react'
import { Platform, StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import dp2px from '../../../utils/common/dp2px';
import { throttle } from '../../../utils/common/utils'
import * as CodeMsg from "../../../utils/common/codeMsg";
import { sendcode, userRegister, checkUsernameExist } from '../../../api/user'
import Toast from 'react-native-root-toast'
import MD5 from "react-native-md5";
import { useSelector, useDispatch } from 'react-redux'
import { getAccountInfo } from '../../../redux/reducers/userInfo'

export default function Register(props) {
  const dispatch = useDispatch()
  const { navigation } = props
  const timer = useRef(null)
  const [codeStatus, setCodeStatus] = useState(false) // 验证码状态
  const [codeCount, setCodeCount] = useState(60) // 验证码倒计时秒数
  const [toggleCheckBox, setToggleCheckBox] = useState(false) // 复选框状态
  const [pwd, setPwd] = useState(true) // 密码状态 true加密 false不加密
  const [repeatPwd, setRepeatPwd] = useState(true) // 核验密码状态 true加密 false不加密

  // 用户名错误提示
  const [userNameErrorText, setUserNameErrorText] = useState('')
  const [userNameError, setUserNameError] = useState(true) // 核验用户名状态 false校验通过 true不通过
  const [userNameBlur, setUserNameBlur] = useState(false) // 是否开始核验 false否 true是

  const [phoneError, setPhoneError] = useState(true) // 核验手机号状态 false校验通过 true不通过
  const [phoneBlur, setPhoneBlur] = useState(false) // 是否开始核验 false否 true是

  const [codeError, setCodeError] = useState(true) // 核验短信验证码状态 false校验通过 true不通过
  const [codeBlur, setCodeBlur] = useState(false) // 是否开始核验 false否 true是

  const [pwdError, setPwdError] = useState(true) // 核验密码状态 false校验通过 true不通过
  const [pwdBlur, setPwdBlur] = useState(false) // 是否开始核验 false否 true是

  const [pwdValidErrorText, setPwdValidErrorText] = useState('')
  const [pwdValidError, setPwdValidError] = useState(true) // 密码是否相同 false相同 true不相同
  const [pwdValidBlur, setPwdValidBlur] = useState(false) // 是否开始核验 false否 true是

  const [userForm, setUserForm] = useState({
    userName: "", // 用户名
    phoneNumber: "",  // 手机号码
    code: "", // 短信验证码
    pwd: "", // 密码
    verifyPwd: "" // 核验密码
  })

  // 获取存储用户信息
  const getUserInfo = (token) => {
    dispatch(getAccountInfo(token))
  }

  // 用户名格式校验+重复校验
  const checkUserName = () => {
    setUserNameBlur(true)
    let reg = /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/;
    if (reg.test(userForm.userName)) {
      checkUsernameExist(userForm.userName).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          setUserNameError(false)
        } else {
          setUserNameErrorText('该账号名已被注册，请换个试试吧~')
          setUserNameError(true)
        }
      })
    } else {
      setUserNameErrorText('请输入4-16位纯字母或字母+数字组合用户名')
      setUserNameError(true)
    }
  }

  // 手机号格式校验
  const checkPhone = () => {
    setPhoneBlur(true)
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(userForm.phoneNumber)) {
      setPhoneError(false)
    } else {
      setPhoneError(true)
    }
  }

  // 密码格式校验
  const checkPwd = () => {
    setPwdBlur(true)
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    if (reg.test(userForm.pwd)) {
      setPwdError(false)
    } else {
      setPwdError(true)
    }
  }

  // 密码一致性判断
  const checkSomePwd = () => {
    setPwdValidBlur(true)
    if (Number(userForm.verifyPwd) == 0) {
      setPwdValidError(true)
      setPwdValidErrorText('请再次输入密码')
    } else {
      if (userForm.pwd == userForm.verifyPwd) {
        setPwdValidError(false)
      } else {
        setPwdValidErrorText('密码不一致，请重新输入')
        setPwdValidError(true)
      }
    }
  }

  // 检查短信验证码是否为空
  const checkCode = () => {
    setCodeBlur(true)
    if (Number(userForm.code) != 0) {
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }

  // 注册格式校验
  const validate = throttle(() => {
    if (userNameError) {
      checkUserName()
    }
    if (phoneError) {
      checkPhone()
    }
    if (codeError) {
      checkCode()
    }
    if (pwdError) {
      checkPwd()
    }
    if (pwdValidError) {
      checkSomePwd()
    }
    let valid = !userNameError && !phoneError && !codeError && !pwdError && !pwdValidError
    if (valid) {
      passValidate()
    }
  }, 1000)

  // 通过验证，调用注册接口
  const passValidate = () => {
    if (toggleCheckBox) {
      registerOperate()
    } else {
      Toast.show('请勾选协议！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
    }
  }

  // 注册操作
  const registerOperate = () => {
    let params = {
      authCode: userForm.code,
      inviteCode: "", // 推广归属
      mobile: userForm.phoneNumber,
      password: MD5.hex_md5(userForm.pwd), // MD5加密
      registerClient: "1",
      username: userForm.userName
    };
    userRegister(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        Toast.show('注册成功！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
        getUserInfo(res.data)
        setTimeout(() => {
          navigation.navigate('Home')
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

  // 更新用户注册表单数据
  const updateUserForm = (type, val) => {
    let temUser = userForm
    switch (type) {
      case 0:
        temUser.userName = val
        break
      case 1:
        temUser.phoneNumber = val
        break
      case 2:
        temUser.code = val
        break
      case 3:
        temUser.pwd = val
        break
      case 4:
        temUser.verifyPwd = val
        break
    }
    setUserForm({ ...userForm, temUser })
  }

  // 更新表单数据
  const changeForm = (type, val) => {
    updateUserForm(type, val.trim())
  }

  // 获取验证码
  const getCode = throttle(() => {
    if (!phoneError) {
      sendcode(userForm.phoneNumber).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          setCodeStatus(true)
          timer.current = setInterval(() => {
            setCodeCount((codeCount) => codeCount - 1)
          }, 1000)
        }
      })
    } else {
      checkPhone()
    }
  }, 1000)

  // 公共跳转
  const toPage = (path) => {
    navigation.navigate(path)
  }

  // 进入页面时调用一次
  useEffect(() => {
    if (codeCount === 0 && timer.current !== null) {
      setCodeStatus(false)
      setCodeCount(60)
      clearInterval(timer.current)
      timer.current = null
    }
  }, [codeCount])

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.registerContain}>
          <Image style={styles.imageSty} source={require('../../../images/personal/register/bg.png')}></Image>
          <View style={styles.contain}>
            <View>
              <Text style={styles.welTitle}>欢迎来到卧涛</Text>
              <Text style={styles.welSmallTitle}>新用户注册</Text>
            </View>
            <View style={styles.formSty}>
              <View style={[styles.formItem, userNameError && userNameBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-user.png')}></Image>
                <TextInput underlineColorAndroid={'transparent'} maxLength={16} keyboardType="email-address" onBlur={(e) => checkUserName(e)} onChangeText={(e) => changeForm(0, e)} value={userForm.userName} style={[styles.formItemInput, styles.longInput]} placeholderTextColor='#B7B4B4' placeholder="请输入4-16位纯字母或字母+数字组合用户名"></TextInput>
                <Text style={styles.errorText}>{userNameError && userNameBlur ? userNameErrorText : ''}</Text>
              </View>
              <View style={[styles.formItem, phoneError && phoneBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-tel.png')}></Image>
                <Text style={styles.errorText}>{phoneError && phoneBlur ? '请填写正确的手机号' : ''}</Text>
                <View style={[styles.formOtherItem, styles.codeWidth]}>
                  <TextInput underlineColorAndroid={'transparent'} maxLength={11} keyboardType="numeric" onBlur={(e) => checkPhone(e)} onChangeText={(e) => changeForm(1, e)} value={userForm.phoneNumber} style={[styles.formItemInput, styles.inputShort]} placeholderTextColor='#B7B4B4' placeholder="请输入手机号码"></TextInput>
                  <TouchableWithoutFeedback disabled={codeStatus} onPress={getCode}>
                    <View style={styles.codeContain}>
                      <Text style={styles.codeTextSty}>{codeStatus ? `${codeCount}s后获取` : '获取验证码'}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={[styles.formItem, codeError && codeBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-shield.png')}></Image>
                <TextInput underlineColorAndroid={'transparent'} maxLength={8} keyboardType="numeric" onBlur={(e) => checkCode(e)} onChangeText={(e) => changeForm(2, e)} value={userForm.code} style={styles.formItemInput} placeholderTextColor='#B7B4B4' placeholder="请输入短信验证码"></TextInput>
                <Text style={styles.errorText}>{codeError && codeBlur ? '请填写正确的验证码' : ''}</Text>
              </View>
              <View style={[styles.formItem, pwdError && pwdBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-unlock.png')}></Image>
                <Text style={styles.errorPwdText}>{pwdError && pwdBlur ? '请输入6~16位字母、数字和符号两种以上组合' : ''}</Text>
                <View style={styles.formOtherItem}>
                  <TextInput underlineColorAndroid={'transparent'} maxLength={16} onBlur={(e) => checkPwd(e)} onChangeText={(e) => changeForm(3, e)} value={userForm.pwd} style={styles.formItemInput} secureTextEntry={pwd} placeholderTextColor='#B7B4B4' placeholder="设置密码（两种或两种以上字符组合）"></TextInput>
                  <TouchableWithoutFeedback onPress={(e) => { setPwd(!pwd, e) }}>
                    <Image style={styles.inputImageSty} source={pwd ? require('../../../images/personal/register/icon-pwd-conceal.png') : require('../../../images/personal/register/icon-pwd-show.png')}></Image>
                  </TouchableWithoutFeedback>
                  <View style={styles.infoView}>
                    <Image style={styles.infoImg} source={require('../../../images/personal/register/info.png')}></Image>
                    <Text style={styles.infoText}>请使用字母、数字和符号(_/#\@*&%)两种及以上组合，6-16个字符</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.formItem, pwdValidError && pwdValidBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-shut.png')}></Image>
                <Text style={styles.errorText}>{pwdValidError && pwdValidBlur ? pwdValidErrorText : ''}</Text>
                <View style={styles.formOtherItem}>
                  <TextInput underlineColorAndroid={'transparent'} maxLength={16} onBlur={(e) => checkSomePwd(e)} onChangeText={(e) => changeForm(4, e)} value={userForm.verifyPwd} style={styles.formItemInput} secureTextEntry={repeatPwd} placeholderTextColor='#B7B4B4' placeholder="请再次输入密码"></TextInput>
                  <TouchableWithoutFeedback onPress={(e) => { setRepeatPwd(!repeatPwd, e) }}>
                    <Image style={styles.inputImageSty} source={repeatPwd ? require('../../../images/personal/register/icon-pwd-conceal.png') : require('../../../images/personal/register/icon-pwd-show.png')}></Image>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <TouchableWithoutFeedback onPress={validate}>
              <View style={styles.btnSty}>
                <Text style={styles.btnTextSty}>注册</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.tipContain}>
              <View style={styles.boxSty}>
                <BouncyCheckbox
                  style={styles.bounSty}
                  size={12}
                  isChecked={toggleCheckBox}
                  textColor="#000"
                  unfillColor="white"
                  fillColor="#36A6FE"
                  onPress={(newValue) => setToggleCheckBox(newValue)}
                />
              </View>
              <Text style={styles.tipStyContain}>
                <Text style={styles.tipSty}>注册后自动登录，勾选即代表您已阅读并同意</Text>
                <TouchableWithoutFeedback onPress={(e) => toPage('UserRegistration', e)}>
                  <Text style={styles.tipActiveSty}>《用户注册协议》</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.tipSty}>和</Text>
                <TouchableWithoutFeedback onPress={(e) => toPage('PrivacyProtection', e)}>
                  <Text style={styles.tipActiveSty}>《隐私保护声明》</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.tipSty}>中的全部条款</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  registerContain: {
    display: 'flex',
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative"
  },
  imageSty: {
    position: "absolute",
    top: dp2px(0),
    width: Dimensions.get("window").width,
    height: dp2px(700),
  },
  contain: {
    width: dp2px(351),
    padding: dp2px(13),
    paddingTop: dp2px(43),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(6),
    position: "absolute",
    height: Dimensions.get('window').height,
    top: dp2px(30),
  },
  welTitle: {
    color: '#000000',
    fontSize: dp2px(32),
    fontWeight: 'bold',
    marginBottom: dp2px(30),
  },
  welSmallTitle: {
    color: '#000000',
    fontSize: dp2px(20),
    fontWeight: 'bold',
    marginBottom: dp2px(20),
  },
  formSty: {
    display: 'flex',
    flexDirection: 'column',
  },
  formItem: {
    position: 'relative',
    width: dp2px(319),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: dp2px(1),
    borderBottomColor: '#DCDCDC',
    marginBottom: dp2px(25)
  },
  formErrorSty: {
    borderBottomColor: '#FE3636',
  },
  formItemInput: {
    width: dp2px(250),
    height: dp2px(43),
    fontSize: dp2px(12),
    color: '#B7B4B4'
  },
  longInput: {
    width: dp2px(300),
  },
  formOtherItem: {
    width: dp2px(300),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputShort: {
    width: dp2px(160)
  },
  inputImageSty: {
    width: dp2px(18),
    height: dp2px(18),
    marginRight: dp2px(20)
  },
  codeContain: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: dp2px(87),
    height: dp2px(29),
    backgroundColor: '#36A6FE',
    borderRadius: 10,
  },
  codeWidth: {
    width: dp2px(282),
  },
  btnSty: {
    backgroundColor: '#36A6FE',
    height: dp2px(44),
    borderRadius: dp2px(15),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp2px(5)
  },
  btnTextSty: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: dp2px(14)
  },
  codeTextSty: {
    color: '#ffffff',
    fontSize: dp2px(12)
  },
  tipContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: dp2px(20),
  },
  boxSty: {
    width: dp2px(15),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: "relative",
    alignItems: 'flex-start',
  },
  bounSty: {
    position: 'absolute',
    top: Platform.OS == 'android' ? dp2px(-3) : dp2px(0)
  },
  tipStyContain: {
    width: dp2px(310),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tipSty: {
    color: '#B7B4B4',
    fontSize: dp2px(12)
  },
  tipActiveSty: {
    color: '#428AFF',
    fontSize: dp2px(12)
  },
  errorText: {
    position: 'absolute',
    bottom: dp2px(-20),
    fontSize: dp2px(12),
    color: '#FE3636'
  },
  errorPwdText: {
    position: 'absolute',
    bottom: dp2px(-32),
    fontSize: dp2px(12),
    color: '#FE3636'
  },
  infoView: {
    position: 'absolute',
    bottom: dp2px(-15),
    left: dp2px(-38),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoImg: {
    width: dp2px(9),
    height: dp2px(9),
  },
  infoText: {
    fontSize: dp2px(9),
    color: '#575b66'
  }
})
