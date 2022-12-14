import axios from 'axios'
import { Message } from 'element-ui';
// 创建axios实例
const service = axios.create({
  withCredentials: true,
  baseURL: "http://vip.nicoun.com/music/api",
  timeout: 15000, // 请求超时时间
});

service.interceptors.request.use(config => {
    //config.headers['Accept'] = 'application/json'
    //config.headers["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest"
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        if (response.data.code !== 200) {
            switch (response.data.code) {
                case 401: // 用户未登录
                    break;
                default:
                    console.log(response.data.msg);
                    Message({
                        message: response.data.msg || '未知错误',
                        type: 'error',
                        center: true
                    })
                    break;
            }
            return Promise.reject(response)
        } else {
            return response.data
        }


    },
    error => {
        if (error.response) {
            const res = error.response.data

            return Promise.reject(res)
        } else {
            return Promise.reject(error)
        }
    }
)

export default service
