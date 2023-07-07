import React, { useState, useEffect, useRef } from 'react'
import { Platform, StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableWithoutFeedback, SafeAreaView, ScrollView } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as CodeMsg from "../../../utils/common/codeMsg";
import { sendcode, newLogin, accountLogin, chooseAccount, getImgCode } from '../../../api/user'
import dp2px from '../../../utils/common/dp2px';
import { throttle } from '../../../utils/common/utils'
import Toast from 'react-native-root-toast'
import MD5 from "react-native-md5";
import { Modal, ModalContent } from 'react-native-modals';
import { useDispatch } from 'react-redux'
import { getAccountInfo } from '../../../redux/reducers/userInfo'
import WxLogin from '../../../components/personal/login/wxLogin'

export default function Login(props) {
  const dispatch = useDispatch()
  const { navigation } = props
  const timer = useRef(null)
  const [tabList] = useState(['手机快捷登录', '账号密码登录']) // 验证码状态
  const [activeIndex, setActiveIndex] = useState(0) // tab栏Index
  const [codeStatus, setCodeStatus] = useState(false) // 验证码状态
  const [codeCount, setCodeCount] = useState(60) // 验证码倒计时时间
  const [toggleCheckBox, setToggleCheckBox] = useState(false) // 复选框状态
  const [pwdStatus, setPwdStatus] = useState(true) // 密码状态
  const [modelStatus, setModelStatus] = useState(false) // 弹窗显示状态
  const [accountList, setAccountList] = useState([]) // 账户选择列表
  const [accountIndex, setAccountIndex] = useState(0) // 账户列表默认选择下标
  const [loginTemp, setLoginTemp] = useState('') // 账户列表默认选择下标
  const [imgCodeStatus, setImgCodeStatus] = useState(false) // 图形验证码显示状态
  const [captchaCode, setCaptchaCode] = useState('') // 填写的图形验证码
  const [base64Image, setBase64Image] = useState('') // 图形验证码url值

  // 用户名错误提示
  const [userNameErrorText, setUserNameErrorText] = useState('')
  const [userNameError, setUserNameError] = useState(true) // 核验用户名状态 false校验通过 true不通过
  const [userNameBlur, setUserNameBlur] = useState(false) // 是否开始核验 false否 true是

  const [phoneError, setPhoneError] = useState(true) // 核验手机号状态 false校验通过 true不通过
  const [phoneBlur, setPhoneBlur] = useState(false) // 是否开始核验 false否 true是

  const [codeError, setCodeError] = useState(true) // 核验短信验证码状态 false校验通过 true不通过
  const [codeBlur, setCodeBlur] = useState(false) // 是否开始核验 false否 true是

  const [pwdErrorText, setPwdErrorText] = useState('')
  const [pwdError, setPwdError] = useState(true) // 核验密码状态 false校验通过 true不通过
  const [pwdBlur, setPwdBlur] = useState(false) // 是否开始核验 false否 true是

  const [userForm, setUserForm] = useState({
    phoneNumber: "",  // 手机号码
    code: "", // 短信验证码
    userName: "", // 账户名称
    pwd: "", // 账户密码
  })

  // 更新用户注册表单数据
  const updateUserForm = (type, val) => {
    let temUser = userForm
    switch (type) {
      case 0:
        temUser.phoneNumber = val
        break
      case 1:
        temUser.code = val
        break
      case 2:
        temUser.userName = val
        break
      case 3:
        temUser.pwd = val
        break
    }
    setUserForm({ ...userForm, temUser })
  }

  // 修改图形验证码值
  const changeCodeInput = (val) => {
    setCaptchaCode(val.trim())
  }

  // 更新表单数据
  const changeForm = (type, val) => {
    updateUserForm(type, val.trim())
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

  // 检查短信验证码是否为空
  const checkCode = () => {
    setCodeBlur(true)
    if (Number(userForm.code) != 0) {
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }

  // 用户名格式校验+重复校验
  const checkUserName = () => {
    setUserNameBlur(true)
    let reg = /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/;
    if (reg.test(userForm.userName)) {
      setUserNameError(false)
    } else {
      setUserNameErrorText('请输入4-16位纯字母或字母+数字组合用户名')
      setUserNameError(true)
    }
  }

  // 密码格式校验
  const checkPwd = () => {
    setPwdBlur(true)
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\@*&%]+$)[\da-zA-Z_/#\@*&%]{6,16}$/;
    if (reg.test(userForm.pwd)) {
      setPwdError(false)
    } else {
      setPwdErrorText('请输入6~16位字母、数字和符号两种以上组合')
      setPwdError(true)
    }
  }

  // 登录格式校验
  const validate = throttle(() => {
    if (toggleCheckBox) {
      activeIndex == 0 ? validatePhone() : validateAccount()
    } else {
      Toast.show('请先勾选协议再进行登录！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
    }
  }, 1000)

  // 手机号+验证码登录方式校验
  const validatePhone = () => {
    if (phoneError) {
      checkPhone()
    }
    if (codeError) {
      checkCode()
    }
    let valid = (!phoneError && !codeError)
    if (valid) {
      passPhoneValidate()
    }
  }

  // 账号密码登录方式校验
  const validateAccount = () => {
    if (userNameError) {
      checkUserName()
    }
    if (pwdError) {
      checkPwd()
    }
    let valid = (!userNameError && !pwdError)
    if (valid) {
      passAccountValidate()
    }
  }

  // 非空验证码提示
  const checkEmptyCode = () => {
    if (captchaCode != '') {
      validate()
    } else {
      Toast.show('验证码不能为空！', {
        position: Toast.positions.CENTER,
        duration: 1000,
        textStyle: {
          fontSize: dp2px(12)
        },
      })
    }
  }

  // 获取图形验证码接口
  const getCodeImgData = () => {
    getImgCode().then(res => {
      setBase64Image(res)
      if (!imgCodeStatus) {
        setImgCodeStatus(true)
      }
    })
  }

  // 账号密码登录
  const passAccountValidate = () => {
    let params = {
      username: userForm.userName,
      password: MD5.hex_md5(userForm.pwd), // MD5加密
      captchaCode: captchaCode,
    }
    accountLogin(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        Toast.show('登录成功！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
        closeCodeImgModel()
        getUserInfo(res.data)
        setTimeout(() => {
          navigation.navigate('Home')
        }, 500)
      } else if (res.code == CodeMsg.CODE_10009) {
        getCodeImgData()
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

  // 手机号+验证码登录
  const passPhoneValidate = () => {
    let params = {
      mobile: userForm.phoneNumber,
      authcode: userForm.code,
    }
    newLogin(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let list = res.data.list
        fixAccountList(list)
        setLoginTemp(res.data.loginTemp)
        if (list.length > 1) {
          setModelStatus(true)
        } else {
          loginRightNow(list, res.data.loginTemp)
        }
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

  // 获取存储用户信息
  const getUserInfo = (token) => {
    dispatch(getAccountInfo(token))
  }

  // accountList赋值
  const fixAccountList = (list) => {
    let temList = list
    setAccountList([...temList])
  }

  // 微信登录（微信绑定一个账户时）status（是否绑定了多个账户）：false:一个 true:多个
  const confirmWxLogin = (status, accountList, loginTemp) => {
    if (status) {
      fixAccountList(accountList)
      setLoginTemp(loginTemp)
      setModelStatus(true)
    } else {
      loginRightNow(accountList, loginTemp)
    }
  }

  // 选择账户登录（仅仅有一个账户时）
  const loginRightNow = (list, loginCode) => {
    let accountId = list[0].accountId
    finalLogin(accountId, loginCode)
  }

  // 选择账户登录（弹窗选择时）
  const chooseAccountLogin = throttle(() => {
    let accountId = accountList[accountIndex].accountId
    finalLogin(accountId, loginTemp)
  }, 1000)

  // 选择账户登录
  const finalLogin = (accountId, loginCode) => {
    let params = {
      accountId: accountId,
      loginTemp: loginCode
    }
    chooseAccount(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        Toast.show('登录成功！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
        getUserInfo(res.data)
        setModelStatus(false)
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

  // 关闭图形验证码弹窗
  const closeCodeImgModel = () => {
    setImgCodeStatus(false)
    setCaptchaCode('')
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

  // tab切换
  const setTabIndex = (index) => {
    setActiveIndex(index)
  }

  // 关闭登录弹窗
  const closeModel = () => {
    setModelStatus(false)
  }

  // 选择按钮
  const chooseAccountIndex = (cIndex, item) => {
    if (item.isDisabled != 1) {
      setAccountIndex(cIndex)
    }
  }

  // 公共跳转
  const toPage = (path) => {
    navigation.navigate(path)
  }

  useEffect(() => {
    if (codeCount === 0 && timer.current !== null) {
      setCodeStatus(false)
      setCodeCount(60)
      clearInterval(timer.current)
      timer.current = null
    }
    console.log(navigation, 'navigation')
  }, [codeCount])

  return (
    <SafeAreaView>
      <View style={styles.loginContain}>
        {/* 选择弹窗 */}
        <Modal visible={modelStatus}>
          <ModalContent>
            <View style={styles.modelContain}>
              <View style={styles.closeContain}>
                <Text onPress={(e) => closeModel(e)} style={styles.closeBtn}>+</Text>
              </View>
              <View>
                <Text style={styles.modelTitle}>选择登录账号</Text>
              </View>
              <View style={styles.modelList}>
                {
                  accountList.map((item, index) => {
                    return (
                      <TouchableWithoutFeedback key={index} onPress={(e) => chooseAccountIndex(index, item, e)}>
                        <View style={styles.modelItem}>
                          <Text style={[styles.modelCircle, accountIndex == index ? styles.activeCircle : '']}></Text>
                          <Text>{item.username}</Text>
                          <Text>{item.isDisabled == 1 ? '（已禁用）' : ''}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )
                  })
                }
              </View>
              <TouchableWithoutFeedback onPress={(e) => chooseAccountLogin(e)}>
                <View style={styles.loginBtn}>
                  <Text style={styles.loginText}>立即登录</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ModalContent>
        </Modal>
        {/* 图形验证码 */}
        <Modal visible={imgCodeStatus}>
          <ModalContent>
            <View style={styles.imgCodeContain}>
              <TouchableWithoutFeedback onPress={(e) => closeCodeImgModel(e)}>
                <View style={styles.codeCloseBtn}>
                  <Text style={styles.codeCloseBtnText}>+</Text>
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.codeImgText}>请输入图中的验证码</Text>
              <View style={styles.codeForm}>
                <TextInput underlineColorAndroid={'transparent'} value={captchaCode} onChangeText={(e) => changeCodeInput(e)} style={styles.codeFormInput} placeholder='请输入右图中的验证码'></TextInput>
                <TouchableWithoutFeedback onPress={(e) => getCodeImgData(e)}>
                  <Image resizeMode='stretch' style={styles.codeImage} source={{ uri: `data:image/png;base64,${base64Image}` }}></Image>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={(e) => checkEmptyCode(e)}>
                <View style={styles.codeBtn}>
                  <Text style={styles.codeBtnText}>确定</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ModalContent>
        </Modal>
        <Image style={styles.imageSty} source={require('../../../images/personal/register/bg.png')}></Image>
        <View style={styles.contain}>
          <View>
            <Text style={styles.welTitle}>欢迎来到卧涛</Text>
          </View>
          <View style={styles.tabContain}>
            {
              tabList.map((item, index) => {
                return (
                  <TouchableWithoutFeedback style={styles.tabItem} key={index} onPress={(e) => setTabIndex(index, e)}>
                    <View style={styles.tabItem}>
                      <Text style={[styles.tabItemText, activeIndex == index ? styles.activeTabItemText : '']}>{item}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })
            }
          </View>
          {activeIndex == 0 ? (
            <View style={styles.formSty}>
              <View style={[styles.formItem, phoneError && phoneBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-tel.png')}></Image>
                <TextInput underlineColorAndroid={'transparent'} value={userForm.phoneNumber} maxLength={11} keyboardType="numeric" onBlur={(e) => checkPhone(e)} onChangeText={(e) => changeForm(0, e)} style={styles.formItemInput} placeholderTextColor='#B7B4B4' placeholder="请输入手机号码"></TextInput>
                <Text style={styles.errorText}>{phoneError && phoneBlur ? '请填写正确的手机号' : ''}</Text>
              </View>
              <View style={[styles.formItem, styles.formItemBottom, codeError && codeBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-shield.png')}></Image>
                <Text style={styles.errorText}>{codeError && codeBlur ? '请填写正确的验证码' : ''}</Text>
                <View style={[styles.formOtherItem, styles.codeWidth]}>
                  <TextInput underlineColorAndroid={'transparent'} value={userForm.code} maxLength={8} keyboardType="numeric" onBlur={(e) => checkCode(e)} onChangeText={(e) => changeForm(1, e)} style={[styles.formItemInput, styles.inputShort]} placeholderTextColor='#B7B4B4' placeholder="请输入验证码"></TextInput>
                  <TouchableWithoutFeedback disabled={codeStatus} onPress={getCode}>
                    <View style={styles.codeContain}>
                      <Text style={styles.codeTextSty}>{codeStatus ? `${codeCount}s后获取` : '获取验证码'}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.formSty}>
              <View style={[styles.formItem, userNameError && userNameBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-user.png')}></Image>
                <TextInput underlineColorAndroid={'transparent'} value={userForm.userName} maxLength={16} keyboardType="email-address" onBlur={(e) => checkUserName(e)} onChangeText={(e) => changeForm(2, e)} style={styles.formItemInput} placeholderTextColor='#B7B4B4' placeholder="请输入账户名称"></TextInput>
                <Text style={styles.errorText}>{userNameError && userNameBlur ? userNameErrorText : ''}</Text>
              </View>
              <View style={[styles.formItem, styles.formItemBottom, pwdError && pwdBlur ? styles.formErrorSty : '']}>
                <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-unlock.png')}></Image>
                <Text style={styles.errorText}>{pwdError && pwdBlur ? pwdErrorText : ''}</Text>
                <View style={styles.formOtherItem}>
                  <TextInput keyboardType="default" autoCapitalize={'none'} value={userForm.pwd} underlineColorAndroid={'transparent'} onBlur={(e) => checkPwd(e)} onChangeText={(e) => changeForm(3, e)} style={styles.formItemInput} secureTextEntry={pwdStatus} placeholderTextColor='#B7B4B4' placeholder="请输入密码"></TextInput>
                  <TouchableWithoutFeedback onPress={(e) => { setPwdStatus(!pwdStatus, e) }}>
                    <Image style={styles.inputImageSty} source={pwdStatus ? require('../../../images/personal/register/icon-pwd-conceal.png') : require('../../../images/personal/register/icon-pwd-show.png')}></Image>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View style={styles.findPwd}>
                <TouchableWithoutFeedback onPress={(e) => toPage('FindPwd', e)}>
                  <View>
                    <Text style={styles.forgetSty}>
                      忘记密码
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )
          }
          <View style={styles.btnContain}>
            <TouchableWithoutFeedback onPress={(e) => validate(e)}>
              <View style={styles.btnSty}>
                <Text style={styles.btnTextSty}>立即登录</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={(e) => toPage('Register', e)}>
              <View>
                <Text style={styles.registerSty}>新用户注册</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={[styles.bottomContain, Platform.OS == 'ios' ? styles.iosBottomContain : '']}>
            {/* 微信登录组件 */}
            <WxLogin props={props} confirmWxLogin={confirmWxLogin} />
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
                <Text style={styles.tipSty}>登录即表示同意</Text>
                <TouchableWithoutFeedback onPress={(e) => toPage('UserRegistration', e)}>
                  <Text style={styles.tipActiveSty}>《用户注册协议》</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.tipSty}>和</Text>
                <TouchableWithoutFeedback onPress={(e) => toPage('PrivacyProtection', e)}>
                  <Text style={styles.tipActiveSty}>《隐私保护声明》</Text>
                </TouchableWithoutFeedback>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  loginContain: {
    height: Dimensions.get('screen').height,
    position: 'relative',
    display: 'flex',
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
  tabContain: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dp2px(30)
  },
  tabItem: {
    flex: 1,
  },
  tabItemText: {
    fontSize: dp2px(16),
    color: '#555555',
  },
  activeTabItemText: {
    color: '#36A6FE',
    fontWeight: 'bold'
  },
  contain: {
    width: dp2px(351),
    padding: dp2px(13),
    paddingTop: dp2px(43),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(6),
    position: "absolute",
    top: dp2px(30),
    height: Dimensions.get("window").height
  },
  welTitle: {
    color: '#000000',
    fontSize: dp2px(32),
    fontWeight: 'bold',
    marginBottom: dp2px(30),
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
    marginBottom: dp2px(20)
  },
  formErrorSty: {
    borderBottomColor: '#FE3636',
  },
  formItemBottom: {
    marginBottom: dp2px(0)
  },
  formItemInput: {
    width: dp2px(250),
    height: dp2px(43),
    fontSize: dp2px(12),
    color: '#B7B4B4'
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
  btnContain: {
    width: dp2px(319),
    position: 'absolute',
    left: dp2px(14),
    top: dp2px(320)
  },
  btnSty: {
    backgroundColor: '#36A6FE',
    height: dp2px(44),
    borderRadius: dp2px(15),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: dp2px(351),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: dp2px(16)
  },
  boxSty: {
    width: dp2px(15),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: "relative",
    alignItems: 'flex-start',
    marginLeft: dp2px(15)
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
  padTop: {
    paddingTop: dp2px(2)
  },
  tipSty: {
    color: '#B7B4B4',
    fontSize: dp2px(12)
  },
  tipActiveSty: {
    color: '#428AFF',
    fontSize: dp2px(12)
  },
  registerSty: {
    color: '#555555',
    marginTop: dp2px(12),
    fontSize: dp2px(12)
  },
  bottomContain: {
    position: "absolute",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: dp2px(130)
  },
  iosBottomContain: {
    bottom: dp2px(160)
  },
  forgetSty: {
    color: '#B4B4B4',
    fontSize: dp2px(10),
    marginTop: dp2px(9),
    marginBottom: dp2px(19)
  },
  errorText: {
    position: 'absolute',
    bottom: dp2px(-20),
    fontSize: dp2px(12),
    color: '#FE3636'
  },
  findPwd: {
    width: dp2px(319),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modelContain: {
    position: 'relative',
    width: dp2px(268),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modelTitle: {
    color: '#333333',
    fontSize: dp2px(16),
    fontWeight: 'bold'
  },
  modelList: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: dp2px(20)
  },
  modelItem: {
    width: dp2px(179),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10
  },
  modelSty: {
    color: '#7B7B7B',
    fontSize: dp2px(14),
    textDecorationLine: 'none'
  },
  loginBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp2px(20),
    width: dp2px(128),
    height: dp2px(36),
    background: '#36a6fe',
    borderRadius: dp2px(4),
    backgroundColor: '#36A6FE'
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: dp2px(12)
  },
  closeContain: {
    position: 'absolute',
    top: dp2px(-20),
    right: dp2px(0),
  },
  closeBtn: {
    color: '#000',
    fontSize: dp2px(30),
    transform: [{
      rotate: '-45deg'
    }]
  },
  modelCircle: {
    width: dp2px(10),
    height: dp2px(10),
    borderRadius: dp2px(10),
    marginRight: dp2px(12),
    backgroundColor: '#7b7b7b',
  },
  activeCircle: {
    backgroundColor: '#428AFF',
  },
  imgCodeContain: {
    position: 'relative',
    width: dp2px(268),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  codeImgText: {
    fontSize: dp2px(14),
    color: '#555555',
    marginBottom: dp2px(20)
  },
  codeForm: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  codeFormInput: {
    width: dp2px(150),
    height: dp2px(30),
    padding: 0,
    marginRight: dp2px(10),
    borderColor: '#333333',
    borderWidth: dp2px(1),
    fontSize: dp2px(12),
    paddingLeft: dp2px(10),
    paddingRight: dp2px(10)
  },
  codeImage: {
    width: dp2px(80),
    height: dp2px(30),
  },
  codeBtn: {
    width: dp2px(100),
    height: dp2px(30),
    backgroundColor: "#36A6FE",
    borderRadius: dp2px(4),
    marginTop: dp2px(20),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  codeBtnText: {
    color: '#FFFFFF',
    fontSize: dp2px(12),
  },
  codeCloseBtn: {
    padding: 0,
    position: 'absolute',
    top: dp2px(-25),
    right: dp2px(-5),
    transform: [{
      rotate: '-45deg'
    }]
  },
  codeCloseBtnText: {
    color: '#000',
    fontSize: dp2px(30),
  }
})
