import http from '../util/HttpUtil';

/**
 * 发送动态
 * @param {String} userId 
 * @param {Array} prictureList
 * @param {String} content
 * @param {Number} privacyLev 隐私程度(0公开；1二度好友及好友；2仅好友；3私密)，默认0
 */
export function publish(params){
  return http.post("/moment-service/moment/publish", params);
}
/**
 * 访客查询某用户公开的动态信息
 * @param {Number} userId
 * @param {Number} currentPage 
 * @param {Number} pageSize
 */
export function queryMomentsByUserId(params){
  return http.post("/moment-service/moment/queryMomentsByUserId", params)
}
/**
 * 自己查询推荐动态接口
 * @param {Number} userId
 * @param {Number} currentPage 
 * @param {Number} pageSize
 */
export function queryRecommendMoments(params){
  return http.post("/moment-service/moment/queryRecommendMoments", params)
}
/**
 * 自己查询好友动态接口
 * @param {Number} userId
 * @param {Number} currentPage 
 * @param {Number} pageSize
 */
export function queryFriendMomentByUserId(params){
  return http.post("/moment-service/moment/queryFriendMomentByUserId", params)
}
/**
 * 点赞
 * @param {Number} userId
 * @param {Number} status
 * @param {String} thumbUsersList 
 */
export function thumb(params){
  return http.post('/moment-service/comment/thumb', params)
}
/**
 * 发送评论
 * @param {Number} userId
 * @param {Number} momentId
 * @param {String} content 
 */
export function remark(params){
  return http.post('/moment-service/comment/remark', params)
}
/**
 * 查看评论信息
 * @param {Number} pageSize
 * @param {Number} currentPage
 * @param {String} commentList
 */
export function queryCommentByCIL(params){
  return http.post('/moment-service/comment/queryCommentByCIL', params)
}

