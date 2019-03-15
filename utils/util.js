
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}






function buildUrl(url, objParams) {
  if (Object.keys(objParams).length > 0) {
    var serializedParams = [];
    Object.keys(objParams).forEach(function (val) {
      serializedParams.push(`${val}=${objParams[val]}`);
    })
    url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams.join('&');
  }
  return url;
};

var cardTypes = {
  0: '身份证',
  1: '护照',
  2: '军官证',
  3: '港澳通行证',
  4: '回乡证',
  99: '其他'
}

function getCustomerType(type) {
  return customerTypes[type];
}

function getCardType(type) {
  return cardTypes[type];
}

function isPassport(type) {
  return type == 1;
}

function getName(item) {
  var nameEn = item.PassengerNameEN,
    name = item.PassengerName,
    pName = '';
  if (name)
    pName = name + ' ';
  if (nameEn && nameEn != '/') {
    pName += nameEn;
  }
  return pName;
}

function message(msg, success) {
  wx.showModal({
    title: '温馨提示',
    content: msg,
    showCancel: false,
    confirmColor: "#59A5F0",
    success: success
  })
}

function confirm(msg, success, fail) {
  wx.showModal({
    title: '温馨提示',
    content: msg,
    showCancel: true,
    confirmColor: "#59A5F0",
    cancelColor: "#59A5F0",
    success: success,
    fail: fail
  })
}

function loadingShow() {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    duration: 120000
  })
}

function verifyName(name) {
  let reg = /^[a-zA-Z\.\u4E00-\u9FA5]{2,28}$/;
  return name == undefined || name == '' || reg.test(name);
}

function verifyPhone(phone) {
  let reg = /^[\d]{11}$/;
  return phone == undefined || phone == '' || reg.test(phone);
}

function verifyFirstName(name) {
  let reg = /^[a-zA-Z]{2,20}$/;
  return name == undefined || name == '' || reg.test(name);
}

function verifyLastName(name) {
  let reg = /^[a-zA-Z]{2,20}$/;
  return name == undefined || name == '' || reg.test(name);
}

/*验证身份证*/
function verifyIdentity(num) {
  num = num.toUpperCase();
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
    //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
    return false;
  //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  //下面分别分析出生日期和校验位
  var len, re;
  len = num.length;
  if (len == 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    var arrSplit = num.match(re);
    //检查生日日期是否正确
    var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
    var bGoodDay;
    bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
    if (!bGoodDay)
      //alert('输入的身份证号里出生日期不对！');
      return false;
    else {
      //将15位身份证转成18位
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0, i;
      num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      num += arrCh[nTemp % 11];
      return true;
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    var arrSplit = num.match(re);

    //检查生日日期是否正确
    var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    var bGoodDay;
    bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
    if (!bGoodDay) {
      //alert(dtmBirth.getYear());
      //alert(arrSplit[2]);
      //alert('输入的身份证号里出生日期不对！');
      return false;
    }
    else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum;
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0, i;
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[nTemp % 11];
      if (valnum != num.substr(17, 1)) {
        //alert('18位身份证的校验码不正确！应该为：' + valnum);
        return false;
      }
      return true;
    }
  }
  return false;
}

function verifyName_2(value) {
  if (value == null || value == '') return true;
  if (value.match(/^([\u4e00-\u9fa5]){2,9}$/) || value.match(/^([a-zA-Z]{2,20})([/])([a-zA-Z]{2,20})$/))
    return true;
  else
    return false;
}

function varifyPassport(value) {
  if (value == null || value == '') return true;

  return /^[A-Za-z0-9]{5,15}$/.test(value);
}

function verifyPostCode(postCode) {
  var reg = /^[1-9][0-9]{5}$/;
  return reg.test(postCode);
}

function verifyEmail(email) {
  var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  return email == '' || email == undefined || reg.test(email);
}

//验证文本输入框只能输入中文英文数字
function isChinaOrNumbOrLett(s) {
  var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
  var reg = new RegExp(regu);
  return reg.test(s);
}

function replaceHtml(str) {
  return str.replace(/<[^>]+>/g, "");
}

module.exports = {
  buildUrl: buildUrl,
  isChild: isChild,
  isAdult: isAdult,
  getCardType: getCardType,
  getName: getName,
  message: message,
  cardTypes: cardTypes,
  customerTypes: customerTypes,
  getCustomerType: getCustomerType,
  countryOption: countryOption,
  isPassport: isPassport,
  verifyName: verifyName,
  verifyPhone: verifyPhone,
  verifyFirstName: verifyFirstName,
  verifyLastName: verifyLastName,
  confirm: confirm,
  verifyIdentity: verifyIdentity,
  verifyName_2: verifyName_2,
  varifyPassport: varifyPassport,
  isChinaOrNumbOrLett: isChinaOrNumbOrLett,
  loadingShow: loadingShow,
  replaceHtml: replaceHtml,
  verifyPostCode: verifyPostCode,
  verifyEmail: verifyEmail
}
