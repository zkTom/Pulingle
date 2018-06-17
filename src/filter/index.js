import defaultAvatarUrl from '../assets/images/default.jpg'
import defaultImgUrl from '../assets/images/error.png';

export function defaultAvatar(avatarUrl, params = ''){
  if (avatarUrl && typeof avatarUrl === 'string') return (avatarUrl + params)
  return defaultAvatarUrl
}
export function defaultImg(imgUrl, params = ''){
  if (imgUrl && typeof imgUrl === 'string') return (imgUrl + params)
  return ''
}
export function getRecentTime(date){

}