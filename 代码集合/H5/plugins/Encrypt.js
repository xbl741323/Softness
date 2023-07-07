import Vue from 'vue'
import CryptoJS from 'crypto-js'
export default {
    //加密
    encrypt(word, keyStr){ 
        keyStr = keyStr || 'abcdefgabcdefg12';
        let key  = CryptoJS.enc.Utf8.parse(keyStr);
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    },
    //解密
    decrypt(word, keyStr){  
        keyStr = keyStr || 'abcdefgabcdefg12';
        let key  = CryptoJS.enc.Utf8.parse(keyStr);
        let decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
    aesDecode(encodePassword) {
        var d = encodePassword;
        var key = CryptoJS.enc.Latin1.parse('abcdefgabcdefg12');//需要与后台保持一致
        var iv = CryptoJS.enc.Latin1.parse('abcdefgabcdefg12');//需要与后台保持一致
        var decrypted = CryptoJS.AES.decrypt(d, key, {
            iv : iv,
            padding : CryptoJS.pad.ZeroPadding
        });
        var password = decrypted.toString(CryptoJS.enc.Utf8);
        return password;
    }

}