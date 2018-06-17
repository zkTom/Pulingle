import Vue from 'vue'
import PulLoading from './Loading.vue'
import _ from 'lodash';
import { addClass,removeClass } from '../../../util/DomUtil'

const LoadingConstructor = Vue.extend(PulLoading);
const defaults = {
  text: '数据加载中...',
  fullscreen: true,
  body: false,
  lock: false,
};
let fullscreenLoading;
LoadingConstructor.prototype.close = function() {
  if (this.fullscreen) {
    fullscreenLoading = undefined;
  }
  this.visible = false;
};

function Loading(options = {}) {
  options = _.assign({}, defaults, options);

  if (typeof options.target === 'string') {
    options.target = document.querySelector(options.target);
  }
  options.target = options.target || document.body;
  if (options.target !== document.body) {
    options.fullscreen = false;
  } else {
    options.body = true;
  }
  if (options.fullscreen && fullscreenLoading) {
    return fullscreenLoading;
  }
  let parent = options.body ? document.body : options.target;
  let instance = new LoadingConstructor({
    data: options
  });
  if (options.fullscreen && options.lock) {
    addClass(parent, 'pul-loading-parent--hidden');
  }
  instance.vm = instance.$mount();
  parent.appendChild(instance.vm.$el);
  Vue.nextTick(() => {
    instance.visible = true;
  });
  if (options.fullscreen) {
    fullscreenLoading = instance;
  }
  return instance;
}

export default Loading;