
/**
 * 将图片转化为等宽，等高画布
 * @param {Image} img
 * @returns {Canvas} cvs 
 */
function imageToCanvas(img){
  let cvs = document.createElement('canvas');
  let ctx = cvs.getContext('2d')
  cvs.width = img.width;
  cvs.height = img.height;
  ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
  console.log(cvs) 
  return cvs
}
/**
 * 将指定的文件转化为图片
 * @param {File} file 
 * @returns {Image} img
 */
function fileToImage(file, succFn, errorFn, width = 50, height = 50){
  if (!file) return;
  const reader = new FileReader();
  const img = new Image(width, height);
  reader.readAsDataURL(file);
  reader.onload = function(evt){
    img.src = evt.target.result;
    document.body.appendChild(img);
    succFn(img)
  };
  // reader.onerror = errorFn;
  reader.onerror = function(evt){
    errorFn(evt)
    console.error('文件转码失败')
  };
}
/**
 * 把指定的Canvas转化为File
 * @param {Canvas} canvas 
 * @param {Number} quality 0-1 
 * @param {Function} fn 回调函数 
 */
function canvasResizetoFile(canvas, quality = 0.7, fn){
  canvas.toBlob(function(blob) {
      fn(blob);
  },'image/jpeg',quality);
};
/**
 * 把指定dataurl(base64)转化为file
 * @param {String} dataurl 
 */
function dataURLtoFile(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
};
/**
 * 压缩图片
 * @param {File} file 
 * @param {Function} fn 
 */
export function compressImage(file, succFn, errorFn){
  if (!file) return;
  fileToImage(file, (img) => {
    let canvas = imageToCanvas(img)
    canvasResizetoFile(canvas, 1, (blob) => {
      succFn(blob)
    })
  }, (evt) => {
   errorFn(evt)
   console.log('转码失败信息:', evt) 
  })
}
export function getNaturalSize (dom) {
  var img = new Image();

  img.src = src;
  img.onload = function(){
    return {
      w: img.width,
      h: img.height
     };
  }
  // return {
  //   w: img.width,
  //   h: img.height
  //  };
  
 }
  

