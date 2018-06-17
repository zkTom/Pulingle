// 以服务的方式调用

import Vue from 'vue'
import ImagePreview from './ImagePreview.vue'

const ImagePreviewConstructor = Vue.extend(ImagePreview);
const imgObj = {
  w: 964,
  h: 1024
}

export default function preview(options = {}){
  let index = options.index;
  let items = options.items;

  if (typeof index !== 'number' || index < 0){
    options.index = 0;
  }
  if (!(items instanceof Array || Array.isArray(items))){
    options.items = [];
  }

  options.items.forEach(item => {
    if (!item.w) item.w = imgObj.w;
    if (!item.h) item.h = imgObj.h;
  });
  let instance = new ImagePreviewConstructor({
    data: options
  });
  let el = document.createElement("div");
  let parent = document.body;
  parent.appendChild(el);

  instance.$mount(el);

  instance.initPhotoSwipe();

}

function destory(instance){
  let el = instance.$el;
  instance.$destroy(true);
  el.parentNode.removeChild(el); 
}