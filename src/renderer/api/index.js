import http from '../utils/http'

//手机登录
export function login(phone, password) {
    return http.get('/login/cellphone?phone=' + phone + '&password=' + password)
}

export function banner(pargams) {
    return http.post('', {
      params: pargams,
    })
}

export function getsong(pargams) {
  return http({
    url: "",
    params: pargams,
    method: "post",
  });
}

