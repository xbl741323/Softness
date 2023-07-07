import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableWithoutFeedback } from 'react-native'
import dp2px from '../../../utils/common/dp2px';
import * as CodeMsg from "../../../utils/common/codeMsg";
import { sendcode, forgetPwdCheck, forgetPwdReset } from '../../../api/user'
import { throttle } from '../../../utils/common/utils';
import ModalDropdown from 'react-native-modal-dropdown';
import { Modal, ModalContent } from 'react-native-modals';
import Toast from 'react-native-root-toast'
import MD5 from "react-native-md5";
/**
 * 忘记密码-修改密码
 */
export default function FindPwd(props) {
  const timer = useRef(null)
  const { navigation } = props
  const [stepFirst, setStepFirst] = useState(true) // 流程步骤
  const [userList, setUserList] = useState([]) // 账号列表
  const [accountIndex, setAccountIndex] = useState(0) // 账号列表
  const [codeStatus, setCodeStatus] = useState(false) // 验证码状态
  const [codeCount, setCodeCount] = useState(60) // 验证码状态
  const [pwd, setPwd] = useState(true) // 密码状态
  const [phoneBlur, setPhoneBlur] = useState(false) // 是否开始核验 false否 true是
  const [phoneError, setPhoneError] = useState(true) // 核验手机号状态 false校验通过 true不通过
  const [codeError, setCodeError] = useState(true) // 核验短信验证码状态 false校验通过 true不通过
  const [codeBlur, setCodeBlur] = useState(false) // 是否开始核验 false否 true是
  const [pwdError, setPwdError] = useState(true) // 核验短信验证码状态 false校验通过 true不通过
  const [pwdBlur, setPwdBlur] = useState(false) // 是否开始核验 false否 true是
  const [modelStatus, setModelStatus] = useState(false) // 弹窗显示状态
  const [loginTemp, setLoginTemp] = useState('') // 账户列表默认选择下标

  const [userForm, setUserForm] = useState({
    phone: '',//手机号码 
    code: '',//验证码
    password: '',//新密码
  })
  //下一步
  const nextBtn = () => {
    if (!phoneError && !codeError) {
      let para = {
        authCode: userForm.code,
        mobile: userForm.phone
      };
      forgetPwdCheck(para).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          setLoginTemp(res.data.loginTemp);
          let index = res.data.userList.findIndex(item => item.isManager == 1);
          setAccountIndex(index);
          setList(res.data.userList);
          setStepFirst(false);
        }
      })
    } else {
      checkPhone();
      checkCode();
    }
  }
  const setList = (list) => {
    setUserList([...list])
  }
  // 选择按钮
  const chooseAccountIndex = (cIndex, item) => {
    if (item.isDisabled != 1) {
      setAccountIndex(cIndex);
      setModelStatus(false)
    }
  }
  // 修改密码完成按钮
  const editPwdBtn = () => {
    if (!pwdError) return validateEdit();
    checkPwd();

  }
  // 所有格式合格修改密码接口
  const validateEdit = () => {
    let para = {
      loginTemp: loginTemp,
      password: MD5.hex_md5(userForm.password),
      userId: userList[accountIndex].userId
    }
    forgetPwdReset(para).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        Toast.show('修改成功！', {
          position: Toast.positions.CENTER,
          duration: 1000,
          textStyle: {
            fontSize: dp2px(12)
          },
        })
        setTimeout(() => {
          navigation.navigate('Login')
        }, 500)
      }
    })
  }
  // 获取验证码按钮
  const getCode = throttle(() => {
    if (!phoneError) {
      sendcode(userForm.phone).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          setCodeStatus(true)
          timer.current = setInterval(() => {
            setCodeCount((codeCount) => codeCount - 1)
          }, 1000)
        }
      })
    } else {
      checkPhone();
    }
  }, 1500)
  // 手机号格式校验
  const checkPhone = () => {
    setPhoneBlur(true)
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(userForm.phone)) {
      setPhoneError(false)
    } else {
      setPhoneError(true)
    }
  }
  // 验证码校验
  const checkCode = () => {
    setCodeBlur(true);
    let reg = /^\d{4,8}$/gim;
    if (reg.test(userForm.code)) {
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }
  // 密码校验
  const checkPwd = () => {
    setPwdBlur(true);
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\@*&%]+$)[\da-zA-Z_/#\@*&%]{6,16}$/;
    if (reg.test(userForm.password)) {
      setPwdError(false)
    } else {
      setPwdError(true)
    }
  }
  // 取值
  const changeForm = (type, val) => {
    let form = userForm;
    switch (type) {
      case 0:
        form.phone = val.trim();
        break
      case 1:
        form.code = val.trim();
        break
      case 2:
        form.password = val.trim();
        break
    }
    setUserForm({ ...userForm, form })
  }
  useEffect(() => {
    if (codeCount === 0 && timer.current !== null) {
      setCodeStatus(false)
      setCodeCount(60)
      clearInterval(timer.current)
      timer.current = null
    }
  }, [codeCount])

  return (
    <View style={styles.modifyContain}>
      <View style={styles.contain}>
        <View style={styles.formSty}>
          {stepFirst && <View>
            <View style={[styles.formItem, phoneError && phoneBlur ? styles.formErrorLine : '']}>
              <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-tel.png')}></Image>
              <View style={[styles.formOtherItem, styles.codeWidth]}>
                <TextInput style={[styles.formItemInput, styles.inputShort]} value={userForm.phone} onChangeText={(e) => changeForm(0, e)} onBlur={(e) => checkPhone(e)} keyboardType="numeric" placeholderTextColor='#B7B4B4' placeholder="请输入手机号码"></TextInput>
                <TouchableWithoutFeedback disabled={codeStatus} onPress={getCode}>
                  <View style={[codeStatus ? styles.bgGray : styles.bgBlue, styles.codeContain]}>
                    <Text style={codeStatus ? styles.codeTextGray : styles.codeTextSty}>{codeStatus ? `${codeCount}s后获取` : '获取验证码'}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <Text style={styles.errorText}>{phoneError && phoneBlur ? '请填写正确的手机号' : ''}</Text>
            </View>
            <View style={[styles.formItem, codeError && codeBlur ? styles.formErrorLine : '']}>
              <Image style={styles.inputImageSty} source={require('../../../images/personal/register/icon-shield.png')}></Image>
              <TextInput style={styles.formItemInput} value={userForm.code} onBlur={(e) => checkCode(e)} onChangeText={(e) => changeForm(1, e)} keyboardType="numeric" placeholderTextColor='#B7B4B4' placeholder="请输入短信验证码"></TextInput>
              <Text style={styles.errorText}>{codeError && codeBlur ? '请填写正确的验证码' : ''}</Text>
            </View>
            <TouchableWithoutFeedback onPress={nextBtn}>
              <View style={styles.btnSty}>
                <Text style={styles.btnTextSty}>下一步</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>}
          {!stepFirst && <View>
            {/* <ModalDropdown options={userList}/> */}
            <View style={styles.formItem}>
              <Image style={styles.inputImageSty} source={require('../../../images/personal/accountSet/icon-key.png')}></Image>
              <View style={styles.formOtherItem}>
                <TextInput style={styles.formItemInput} autoCorrect={false} value={userList[accountIndex].username}></TextInput>
                <Text style={styles.txtBtn} onPress={() => { setModelStatus(true) }}>切换账号</Text>
              </View>
            </View>
            <View style={[styles.formItem, pwdError && pwdBlur ? styles.formErrorLine : '']}>
              <Image style={styles.inputImageSty} source={require('../../../images/personal/accountSet/icon-key.png')}></Image>
              <View style={styles.formOtherItem}>
                <TextInput style={styles.formItemInput} secureTextEntry={pwd} placeholderTextColor='#B7B4B4' onBlur={(e) => checkPwd(e)} onChangeText={(e) => changeForm(2, e)} placeholder="请输入新密码(最少6位，数字+字母组合)"></TextInput>
                <TouchableWithoutFeedback onPress={(e) => { setPwd(!pwd, e) }}>
                  <Image style={styles.inputImageSty} source={pwd ? require('../../../images/personal/register/icon-pwd-conceal.png') : require('../../../images/personal/register/icon-pwd-show.png')}></Image>
                </TouchableWithoutFeedback>
              </View>
              <Text style={styles.errorText}>{pwdError && pwdBlur ? '请按要求填写密码' : ''}</Text>
            </View>
            <TouchableWithoutFeedback onPress={editPwdBtn}>
              <View style={styles.btnSty}>
                <Text style={styles.btnTextSty}>完成</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>}
        </View>
      </View>
      <Modal visible={modelStatus}>
        <ModalContent>
          <View style={styles.modelContain}>
            <View style={styles.closeContain}>
              <Text onPress={() => { setModelStatus(false) }} style={styles.closeBtn}>+</Text>
            </View>
            <View>
              <Text style={styles.modelTitle}>选择账号</Text>
            </View>
            <View style={styles.modelList}>
              {
                userList.map((item, index) => {
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
          </View>
        </ModalContent>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  errorText: {
    position: 'absolute',
    bottom: dp2px(-20),
    width: Dimensions.get("window").width,
    color: '#FE3636'
  },
  modifyContain: {
    height: Dimensions.get('screen').height,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: "relative"
  },
  contain: {
    width: dp2px(351),
    padding: dp2px(13),
    backgroundColor: '#ffffff',
    borderRadius: dp2px(6),
    position: "absolute",
    top: dp2px(12),
    height: Dimensions.get("window").height
  },
  formSty: {
    display: 'flex',
    flexDirection: 'column',
  },
  formItem: {
    width: dp2px(319),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: dp2px(1),
    borderBottomColor: '#DCDCDC',
    marginBottom: dp2px(20)
  },
  formErrorLine: {
    borderBottomColor: '#FE3636',
  },
  formItemInput: {
    width: dp2px(250),
    height: dp2px(43),
    fontSize: dp2px(12),
    color: '#666'
  },
  formOtherItem: {
    width: dp2px(300),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  txtBtn: {
    marginRight: dp2px(40),
    position: 'absolute',
    right: 0,
    color: '#36A6FE'
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
    borderRadius: 6,
    color: '#ffffff',
  },
  bgBlue: {
    backgroundColor: '#36A6FE',
  },
  bgGray: {
    backgroundColor: '#EDEDED',
    color: 'black',
  },
  codeWidth: {
    width: dp2px(282),
  },
  btnSty: {
    backgroundColor: '#36A6FE',
    marginTop: dp2px(30),
    height: dp2px(44),
    borderRadius: dp2px(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36A6FE',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
    // box-shadow: 0px 6px 12px 0px rgba(70,139,240,0.50)
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
  codeTextGray: {
    color: '#B7B4B4',
    fontSize: dp2px(12)
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
  }
})
