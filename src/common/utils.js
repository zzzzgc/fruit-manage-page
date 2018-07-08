import * as moment from 'moment'
import * as lodash from 'lodash'

// 格式化日期，如果未穿值则返回当前时间的格式化字符串
export function dateFmt (date) {
  if (date === undefined || date === null || date === '') {
    return ''
  }
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function dateArrayFmt (dateArray) {
  if (dateArray === undefined || dateArray === null || dateArray.length === 0) {
    return []
  }
  let arr = []
  for (let i in dateArray) {
    arr.push(moment(dateArray[i]).format('YYYY-MM-DD'))
  }
  return arr
}
export function dateArrayFmtDefined (dateArray, format) {
  if (dateArray === undefined || dateArray === null || dateArray.length === 0) {
    return []
  }
  let arr = []
  for (let i in dateArray) {
    arr.push(moment(dateArray[i]).format(format))
  }
  return arr
}

// 将对象中的null属性转换为空字符串
export function objNullToBlank (obj) {
  if (obj === undefined || obj === null) {
    return ''
  }
  let objNew = Object.assign({}, obj)
  for (let attr in objNew) {
    if (objNew[attr] == null) {
      objNew[attr] = ''
    }
  }
  return objNew
}

// 格式化日期字符串 转日期格式
export function stringFmtDate (time) {
  if (time === null) {
    return new Date()
  }
  return new Date(time)
}

// 去重操作
export function uniqeByKeys (array, keys) {
  array = array || []
  keys = keys || []
  if (array.length > 0 && keys.length === 0) {
    for (var p in array[0]) {
      keys.push(p)
    }
  }
  let arr = []
  let hash = {}
  for (let i = 0, j = array.length; i < j; i++) {
    let k = obj2key(array[i], keys)
    if (!(k in hash)) {
      hash[k] = true
      arr.push(array[i])
    }
  }
  return arr
}
// 将对象元素转换成字符串以作比较
function obj2key (obj, keys) {
  let n = keys.length
  let key = []
  while (n--) {
    key.push(obj[keys[n]])
  }
  return key.join('|')
}
// 字符串转整型
export function stringToInt (val) {
  return val === null ? '' : parseInt(val)
}

export function deepCopy (source) {
  return lodash.cloneDeep(source)
}
