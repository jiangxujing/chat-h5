import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import ApiList from './api.json'
import { MessageBox, Loading } from 'element-ui'
Vue.component(MessageBox.name, MessageBox)

let loading = null
let CancelToken = axios.CancelToken
let cancel

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}

const prefix = '/commerce-web'
const prefix2 = '/play-web'

const _parseJSON = str => {
    if (typeof str === 'object') {
        return str
    }
    try {
        return JSON.parse(str)
    } catch (ex) {}
    return (new Function('', 'return ' + str))()
}

const getUrl = key => {
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    let url = prefix + ApiList[key]
    return url
}
const getUrl2 = key => {
    if (typeof ApiList[key] === 'undefined' || ApiList[key] === '') {
        return ''
    }
    let url = prefix2 + ApiList[key]
    return url
}
const postExcel = (url, data) => {
     let token = localStorage.getItem('token')
    const sec = 6000
    let postData = {}

    // 清除loading 动画
    let closeLoading = function() {
            loading && loading.close()
        }
        // loading 动画
    let showLoading = function() {
        loading && loading.close()
        loading = Loading.service({
            target: '#main-root',
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }

    if (data) {
        data = filterNull(data)
    }

    let _data = _.assign({}, data)
    _.forEach(_data, (val, key) => {
        if (['timeout'].indexOf(key) === -1) {
            postData[key] = val
        }
    })

    let timeout = _data['timeout'] || 10 * sec

    return axios({
        method: 'post',
        url: url,
        async:false,
        data: postData,
        responseType:'blob',
        timeout: timeout,
        headers: { 'token': token },
        CancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c
        })
    }).then(function(resp) {
        closeLoading()
        if (resp.status >= 200 && resp.status < 300) {
            let respData = resp.data
           
          /*  alert(respData['code'])*/
            return Promise.resolve(respData)
        }
        return Promise.reject(new Error(resp.status))
    }).catch(function(err) {
        console.log(err)
        closeLoading()
        MessageBox.alert('网络不可用，请稍后再试', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
        })
        return Promise.reject(new Error(err))
    })
}


// 一般请求
const post = (url, data) => {
     let token = localStorage.getItem('token')
    const sec = 6000
    let postData = {}

    // 清除loading 动画
    let closeLoading = function() {
            loading && loading.close()
        }
        // loading 动画
    let showLoading = function() {
        loading && loading.close()
        loading = Loading.service({
            target: '#main-root',
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }

    if (data) {
        data = filterNull(data)
    }

    let _data = _.assign({}, data)
    _.forEach(_data, (val, key) => {
        if (['timeout'].indexOf(key) === -1) {
            postData[key] = val
        }
    })

    let timeout = _data['timeout'] || 10 * sec

    return axios({
        method: 'post',
        url: url,
        async:false,
        data: postData,
        timeout: timeout,
        headers: { 'token': token },
        CancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c
        })
    }).then(function(resp) {
        closeLoading()
        if (resp.status >= 200 && resp.status < 300) {
            let respData = resp.data
           respData['code'] = ~~(respData['code'])
            if(typeof(respData['content']) == 'string'){
            }else{
            	 respData['content'] = _parseJSON(respData['content'])
            }
             /*  alert(respData['code'])*/
           if (respData['code'] === 5040) {
                cancel && cancel()
             		MessageBox.alert('登录状态失效，请重新登录！', '提示', {
                    confirmButtonText: '去登录',
                    callback: action => {
                        let url = location.origin + '/login'
                      localStorage.removeItem('username')
                      localStorage.removeItem('token')
                        window.location.replace(url)
                        return Promise.resolve(respData)
                    }
                })
            }
            return Promise.resolve(respData)
        }
        return Promise.reject(new Error(resp.status))
    }).catch(function(err) {
        console.log(err)
        closeLoading()
//      MessageBox.alert('网络不可用，请稍后再试', '提示', {
//          confirmButtonText: '确定',
//          callback: action => {}
//      })
        return Promise.reject(new Error(err))
    })
}
/**
 * 上传(不需要对数据做过滤处理)
 **/
const upload = (url, data) => {
    let token = localStorage.getItem('token')
    const sec = 6000
    // 清除loading 动画
    let closeLoading = function() {
            loading && loading.close()
        }
        // loading 动画
    let showLoading = function() {
        loading && loading.close()
        loading = Loading.service({
            target: '#main-root',
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }

    let timeout = 10 * sec

    return axios({
        method: 'post',
        url: url,
        data: data,
        timeout: timeout,
        headers: { 'token': token },
        CancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c
        })
    }).then(function(resp) {
        closeLoading()
        if (resp.status >= 200 && resp.status < 300) {
            let respData = resp.data
            respData['code'] = ~~(respData['code'])
                // respData['content'] = _parseJSON(respData['content'])
            if (respData['code'] === 5040) {
                cancel && cancel()
                MessageBox.alert('登录状态失效，请重新登录！', '提示', {
                    confirmButtonText: '去登录',
                    callback: action => {
                        let url = location.origin + location.pathname + '/Login'
                        localStorage.removeItem('userName')
                        localStorage.removeItem('token')
                        localStorage.removeItem('role')
                        window.location.replace(url)
                        return Promise.resolve(respData)
                    }
                })
            }
            return Promise.resolve(respData)
        }
        return Promise.reject(new Error(resp.status))
    }).catch(function(err) {
        console.log(err)
        closeLoading()
        MessageBox.alert('网络不可用，请稍后再试', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
        })
        return Promise.reject(new Error(err))
    })
}



const get = (url) =>{
  let closeLoading = function() {
    loading && loading.close()
  }
  let showLoading = function() {
    loading && loading.close()
    loading = Loading.service({
      target: '#main-root' ,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
//if (params) {
//  params = filterNull(params)
//}
  showLoading()
  return axios({
    method: 'get',
    url: url,
    withCredentials: false
  })
    .then(function (res) {
      closeLoading()
    })
    .catch(function (err) {
      closeLoading()
      if (err) {
        if (err.dese) {
          console.log(err)
          MessageBox.alert(err.dese, '提示')
        } else {
          MessageBox.alert('网络不可用，请稍后重试', '提示')
        }
      }
    })
}


// 返回在vue模板中的调用接口
export default {
    dateFormat: function(row, column) {
        var date = row[column.property];
        return date ? dateFormatter(new Date(date).getTime(), 'yyyy-MM-dd') : '';
    },
    amountFormat: function(row, column) {
        var amount = row[column.property];
        return amount ? amountFormat(amount) : '0.00';
    },
    emptyFormat: function(row, column) {
        var data = row[column.property]
        return data ? data : '/'
    },
    getUrl,
    getUrl2,
    postExcel,
    post,
    upload,
    get,
    cancel: () => {
        cancel && cancel()
    }
}
