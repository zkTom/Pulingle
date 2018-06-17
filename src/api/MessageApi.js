import http from '../util/HttpUtil';


// 发送短信
export function sendCode(params){
  return http.post("/message-service/sendSMS", params);
}
// 验证码验证
/**
 * 
 * @param {String} phone
 * @param {String} authCode 
 */
export function checkCode(params){
  return http.post('/message-service/checkAuthCode', params);
}
// 注册
/**
 * 
 * @param {String} account 注册账号
 * @param {String} password 密码
 * @param {String} nickName 昵称 
 */
export function register(params){
  return http.post('/user-service/user/register', params);
}
/**
 * 获取用户好友请求消息
 * @param {Number} userId
 */
export function getFriendRequest(params){
  return http.post('/message-service/message/getFriendRequest', params);
}
/**
 * 发送好友请求
 * @param {Number} sendUserId
 * @param {Number} receUserId 
 */
export function sendFriendRequest(params){
  return http.post('message-service/message/sendFriendRequest', params)
}
/**
 * 删除好友请求消息
 * @param {Number}  userId
 */
export function deleteFriendRequest(params){
  return http.post('/message-service/message/deleteFriendRequest', params);
}
/**
 * 获取消息列表
 * @param {Number} userId 
 * @param {Number} friendId
 * @param {Number} pageSize
 * @param {Number} currentPage
 */
export function getMessageRecords(params){
  return http.post('/message-service/message/getMessageRecords', params)
}
/**
 * 发送消息列表
 * @param {Number} type
 * @param {Number} sendUserId
 * @param {Number} receUserId
 * @param {String} content 
 */
export function send(params){
  return http.post('/message-service/message/send', params)
}
/**
 * 查询用户各个类型的新消息数
 * @param {Number} userId 
 */
export function getMessageNum(params){
  return http.post('/message-service/message/getMessageNum', params)
}
/**
 * 设置消息已阅状态
 * @param {Number} sendUserId
 * @param {Number} receUserId 
 */
export function readMessage(params){
  return http.post('/message-service/message/readMessage', params)
}
