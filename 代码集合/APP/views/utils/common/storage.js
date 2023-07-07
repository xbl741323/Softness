import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * AsyncStorage封装
 */

class Storage {
  /**
   * 存储指定key数据
   * @param {string} key 
   * @param {mixed} value 
   * @returns {Promise}
   */
  static setItem(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * 获取指定key数据
   * @param {string} key 
   * @returns {Promise}
   */
  static getItem(key) {
    return AsyncStorage.getItem(key).then(value => {
      if (value && value !== '') {
        const jsonValue = JSON.parse(value)
        return jsonValue
      }
    }).catch(() => null)
  }

  /**
   * 移除指定key
   * @param {string} key 
   * @returns {Promise}
   */
  static removeItem(key) {
    return AsyncStorage.removeItem(key)
  }

  /**
   * 清空所有key数据
   */
  static clear() {
    return AsyncStorage.clear()
  }
}

export default Storage

