import http from '../util/HttpUtil';
import headers from './headers';
// import headers from './headers'
/**
 * 获取图形验证码
 * @param {String} timeStamp  
 */
export function getCaptcha(params){
  return http.post("/user-service/user/getCaptcha", params);
}
/**
 * 登录
 * @param {String} account
 * @param {String} password
 * @param {String} captcha 
 * @param {Number} timeStamp
 */
export function login(params){
  return http.post("/user-service/user/login", params);
}
/**
 * 快速登录
 * @param {String} token 
 */
export function quickLogin(params){
  return http.post('/user-service/user/tokenResolve', params)
}
/**
 * 注销
 * @param {String} token 
 */
export function logout(params){
  return http.post('user-service/user/logout', params)
}
/**
 * 修改用户信息
 * @param {String} nickname
 * @param {Number} sex
 * @param {Number} user_id 
 * @param {String} email
 * @param {String} signature
 */
export function updateUserInfo(params){
  return http.post('user-service/user/updateUserInfo', params)
}
/*
 * 添加好友
 * @param {Number} userId
 * @param {Number} friendId
 * @param {Number} messageId
 */
export function acceptFriendRequest(params){
  return http.post('user-service/acceptFriendRequest', params, false, headers[1])
}
/**
 * 删除好友
 * @param {Number} userId
 * @param {Number} friendId 
 */
export function deleteFriend(params){
  return http.post('user-service/deleteFriend', params, false,headers[1])
}
/**
 * 保存用户头像
 * @param {String} user_id
 * @param {String} profile_picture_url 
 */
export function saveProfilePicture(params){
  return http.post('user-service/user/saveProfilePicture', params)
}
/**
 * 获取好友消息列表
 * @param {Number} userId 
 */
export function getFriendWithMessageList(params){
  return http.post('user-service/outUserInfo/getFriendWithMessageList', params)
}
/**
 * 获取好友最新发动态消息时间
 * @param {Number} userId
 * @param {Number} num 
 */
export function queryFriendMomentStatus(params){
  return http.post('/user-service/user/queryFriendMomentStatus', params)
}
/**
 * 根据昵称查询用户
 * @param {String} nickname
 * @param {Number} num
 */
export function searchByNickname(params){
  return http.post('/user-service/user/searchByNickname', params)
}
