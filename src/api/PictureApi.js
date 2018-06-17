import http from '../util/HttpUtil';

/**
 * 动态图片同步到照片墙接口
 * @param {Number} userId
 * @param {Array}  pictureList
 */
export function syncroAlbum(params){
  return http.post('/picture-service/picture/syncroAlbum', params)  
}
/**
 * 查看照片墙信息
 * @param {Number} userId
 * @param {Number} pageSize 
 * @param {Number} pictureNum
 * @param {Number} currentPage
 */
export function queryAlbumPictureByForWall(params){
  return http.post('/picture-service/picture/queryAlbumPictureByForWall', params)
}
/**
 * 查询用户的9张照片
 * @param {Number} userId 
 */
export function queryNewAlbumPicture(params){
  return http.post('/picture-service/picture/queryNewAlbumPicture', params)
}
/**
 * 按月份查询照片墙
 * @param {Number} userId 
 * @param {Number} month
 * @param {Number} pictureNum
 */
export function queryAlbumPictureByMonth(params){
  return http.post('/picture-service/picture/queryAlbumPictureByMonth', params)
}
/**
 * 删除照片墙照片
 * @param {Number} albumPictureId 
 */
export function deleteAlbumPicture(params){
  return http.post('/picture-service/picture/deleteAlbumPicture', params)
}