<template>
  <div class="pul-upload__wrapper">
    <div class="pul-upload__picture" @click="handleClick">
      <button class="btn btn-default">
        <span class="iconfont icon-picture"></span>插入图片
      </button>
      <input type="file" name="file" ref="file" id="file" class="pul-upload__input"
        @change="handleChange($event)">
    </div>
    <transition-group tag="ul" name="fadeInDown" class="pul-upload__list" @after-leave="handleAnimationEnd">
      <li class="pul-upload__item" v-for="(item, index) in fileList" :key="index"
        @mouseenter="handleEnter(index)"
        @mouseleave="handleLeave(index)">
        <img :src="item.pictureUrl | defaultImg('?x-oss-process=image/resize,m_fixed,h_100,w_100')" alt="" class="pul-upload__item-thumbnail">
          <div class="pul-upload__item-detail" v-if="!item.loading || item.pictureUrl" 
          v-show="item.pictureUrl && (index === curIndex)">
            <span class="iconfont icon-trash" @click="handleRemove(index)"></span>
            <span class="pul-upload__item-name">{{item.name}}</span>
          </div>
        <label class="pul-upload-list__item-status-label" :class="{'is-error': !item.pictureUrl}">
          <span :class="['iconfont', {'icon-icon_success': !item.loading || item.pictureUrl},
          {'icon-error': !item.pictureUrl}]">
          </span>
        </label>
        <!--loading bar-->
        <p class="pul-upload-loading" v-show="!item.pictureUrl">
          <span class="iconfont icon-loading"></span> 上传中...</p>
      </li>
    </transition-group>
  </div>
</template>

<script>
import ajax from './ajax';
import {compressImage} from '../../util/ImageUtil';

const IMG_TYPE = ['png', 'bmp', 'gif', 'jpg', 'jpeg', 'jpg', 'tiff'];
const MAX_SIZE = 5 * 1024 * 1024;
const noop = () => {};

export default {
  name: 'pul-upload',
  data(){
    return {
      show: false,
      reqs:{},
      curIndex: '',
      loading: false
    }
  },
  props: {
    action: String,
    data: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    fileName: {
      type: String,
      default: 'file'
    },
    headers: Object,
    httpRequest: {
      type: Function,
      default: ajax
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    onRemove: {
      type: Function,
      default: noop
    },
    limit: {
      type: Number,
      default: 9
    },
    onExceed: Function
  },
  watch: {
    fileList(val){
      if (!val.length) return;
      let lastIndex = val.length - 1;
      if (!val[lastIndex].loading) val[lastIndex].loading = false;
    }
  },
  methods: {
    handleAnimationEnd(){
      
    },
    handleRemove(index){
      let fileList = this.fileList;
      this.abort(fileList[index]);
      fileList.splice(index, 1);
      this.onRemove(index);
    },
    handleEnter(index){
      this.curIndex = index;
    },
    handleLeave(index){
      this.curIndex = '';
    },
    handleClick(){
      this.$refs.file.value = null;
      this.$refs.file.click();
    },
    handleChange(e){
      let files = e.target.files;
      if (!this.isMaxCount(files)) {

        this.fileList.push({name:'', url:'', type: '', size: '',loading: true});
        this.uploadFiles(files);
      }
      return;
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    checkFile(file){
      let fileName = file.name;
      let lastDotIndex = fileName.lastIndexOf(".");
      let ext = fileName.substring(lastDotIndex + 1).toLowerCase();

      if (this.isMaxSize(file.size)) {
        this.onError && this.onError(file);
        return false;
      }
      if (lastDotIndex < 0 || !this.isImage(ext)) {
        this.onError && this.onError(file);
        return false;
      }

      return true;
    },
    uploadFiles(files){
      let postFiles = Array.prototype.slice.call(files);
      postFiles = postFiles.slice(0, 1);

      if (postFiles.length === 0) { return; }

      postFiles.forEach(rawFile => {
        // 先压缩
        // compressImage(rawFile, (file) => {
        //   this.upload(file);
        // }, (evt) => {
        //   this.upload(rawFile)
        //   console.error(evt)
        // })
        // lrz(file, {width: 50, height: 50}).then((rst) => {
        //   console.log(rst)
        //   return;
        // }).catch(err => {
        //   this.upload(rawFile)
        //   console.error(err)
        // })
        if (this.checkFile(rawFile)){
          this.upload(rawFile)
        } else {
          console.log('pop')
          this.fileList.pop();
        }
      });
    },
    upload(rawFile){
      let fileList = this.fileList;
      let lastIndex = fileList.length - 1;
      const uid = rawFile.lastModified;
      const options = {
        file: rawFile,
        filename: this.fileName,
        data: this.data,
        action: this.action,
        headers: this.headers,
        onProgress: e => {
          this.onProgress(e, rawFile);
        },
        onSuccess: res => {
          fileList[lastIndex].loading = false;
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          fileList[lastIndex].loading = false;
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    isImage(ext){
      if (IMG_TYPE.indexOf(ext) !== -1) return true;
      this.$message.warning('只支持上传图片')
      return false;
    },
    isMaxSize(size){
      if (size <= MAX_SIZE) return false;
      this.$message.warning(`照片过大,最大${MAX_SIZE / 1024 / 1024}M`);

      return true;      
    },
    isMaxCount(files){
      let limit = this.limit;
      let len = files.length;
      let rawLen = this.fileList.length;

      if (limit && limit >= (len + rawLen)) {
        return false;
      }
      this.onExceed();
      this.$message.warning(`数量超限,最大${limit}张`);
      return true;
    }
  }
}
</script>
<style lang="scss">
$color-green: RGBA(33, 178, 146, 1);
.pul-upload__wrapper{
  
}
.pul-upload__picture{
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  text-align: center;

  .btn{
    color: $color-green;
  }

  .icon-picture{
    color: $color-green;
    padding-right: 5px;
    position: relative;
  }

  .pul-upload__input{
    display: none;
  }
}
.pul-upload__list{
  margin: 0;
  padding: 0;
  list-style: none;

  .pul-upload__item{
    cursor: pointer;
    border-radius: 6px;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    overflow: hidden;

    img{
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    &:last-child{
      margin-right: 0;
    }

    .pul-upload-loading{
      background-color: rgba(0, 0, 0, .4);
      border-radius: 6px;
      color: #fff;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left:0;
      padding-top: 40%;
      text-align: center;
      overflow: hidden;
      z-index: 3;

      .icon-loading{
        animation: loading-rotate 1s linear infinite;
        display: inline-block;
      }
    }
  }

  .pul-upload__item-detail{
    background-color: rgba(0, 0, 0, .4);
    border-radius: 6px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left:0;
    overflow: hidden;
    z-index: 2;

    > span{
      color: #fff;
      display: block;
      font-size: 18px;
      margin: 0 auto;
      margin-bottom: 0px;
      text-align: center;
    }

    .icon-trash{
      margin-top: 20px;
      margin-left: 50%;
      transform: translateX(-50%);
    }

    .pul-upload__item-name{
      font-size: 12px;
      width: 100%;
      @include text-ellipsis;
    }
  }

  .pul-upload-list__item-status-label{
    position: absolute;
    right: -26px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 1px 1px #ccc;

    &.is-error{
      background: #de5151;
      color: orange;
    }

    .icon-error{
      position: absolute;
      top:8px;
      right: 22px;
    }

    .icon-icon_success{
      color: #fff;
      position: absolute;
      font-size: 14px;
      transform: rotate(-45deg);
      left: 10px;
      top: 8px;
      z-index: 3;
    }
  }
}
</style>


