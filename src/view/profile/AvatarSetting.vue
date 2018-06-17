<template>
  <div class="avatar-setting-container">
    <div class="avatar-setting">
      <div class="upload-avatar-wrapper">
        <div class="upload-avatar" @click.stop="handleClick">
          <span class="iconfont icon-plus"></span>
          <input type="file" id="avatar" ref="avatar" @change="handleChange">
          <img :src="avatarUrl" alt="" v-if="avatarUrl" @click.stop>
          <span class="another-choice" @click="handleSelect">重新选择</span>
        </div>
      </div>
      <div class="border-line"></div>
      <div class="preview-avatar">
        <div class="preview-container" :style="backgroundImge">
          <!-- <img :src="" alt=""> -->
        </div>
        <span>预览头像</span>
      </div>
    </div>
    <div class="btn-group">
      <span class="upload-tip">图片上传支持JPG，PNG等格式，图片需小于5M</span>
      <button class="btn btn-primary" @click="update">更新</button>
    </div>
  </div>
</template>
<script>
import ajax from '../../component/common/ajax';
import {saveProfilePicture} from '../../api/UserApi'
import Cookies from 'js-cookie'
const IMG_TYPE = ['png', 'bmp', 'gif', 'jpg', 'jpeg', 'jpg', 'tiff'];
const MAX_SIZE = 5 * 1024 * 1024;
export default {
  name: 'avatar-setting',
  data(){
    return {
      limit: 1,
      fileList: [],
      action: '/zuul/picture-service/picture/upload',
      fileName:'file',
      data: {},
      httpRequest: ajax,
      reqs: {},
      headers: {
        token: Cookies.get('token')
      }
    }
  },
  computed: {
    userInfo(){
      return this.$store.getters.userInfo
    },
    backgroundImge(){
      let styleObj = {};
      if (!this.fileList.length){
        styleObj.backgroundImage = `url(${this.userInfo.profile_picture_url})`;
      } else {
        let newUrl = this.fileList[0].url;
        styleObj.backgroundImage = `url(${newUrl})`;
      }

      return styleObj;
    },
    avatarUrl(){
      let url = '';
      if (this.fileList.length) url = this.fileList[0].url;
      
      return url;
    }
  },
  methods:{
    async update(){
      if (!this.fileList.length) {
        this.$message.warning('请先上传照片')
        return
      }
      try {
        let form = {
          user_id: this.userInfo.user_id,
          profile_picture_url: this.fileList[0].url
        }
        let res = await saveProfilePicture(form) 
        if (res.status == 1) {
          this.$store.commit('user/set_profilePictureUrl', form.profile_picture_url);
          let __localAuthInfoStr = sessionStorage.getItem("__local_auth_info");
          let userInfo = JSON.parse(__localAuthInfoStr);
          userInfo.profile_picture_url = form.profile_picture_url;
          sessionStorage.setItem("__local_auth_info", JSON.stringify(userInfo || {}));
          this.$message.success('头像修改成功')
        } else {
          this.$message.error(res.data || '修改失败，请重试')
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleClick(){
      this.$refs.avatar.value = null;
      this.$refs.avatar.click();
    },
    handleChange(event){
      let files = event.target.files;
      if (!this.isMaxCount(files)) {
        this.uploadFiles(files);
      }
    },
    handleSelect(){
      if (this.fileList.length) this.fileList.splice(0, 1);
      this.$nextTick(() => {
        this.handleClick()
      });
    },
    onSuccess(res, file){
      this.fileList.push({url: res.data.pictureUrl})
    },
    onProgress(){

    },
    onError(){
      
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
        if(this.checkFile(rawFile)) {
          this.upload(rawFile)
        }
      });
    },
    upload(rawFile){
      this.data.userId = this.userInfo.user_id;
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
          this.loading = false;
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => {
          this.loading = false;
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
      this.$message.warning(`数量超限,最大${limit}张`);
      return true;
    }
  }
}
</script>
<style lang="scss">
.avatar-setting-container{
  position: absolute;
  width: 100%;
  padding: 20px 0;

  .avatar-setting{
    margin: 30px 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    .border-line{
      height: 182px;
      width: 1px;
      background: #e5e9ef;
    }
  }

  .btn-group{

    span,button{
      text-align: center;
      display: block;
    }

    span.upload-tip{
      line-height: 16px;
      color: #99a2aa;
    }

    button.btn{
      margin: 40px auto 0;
      width: 140px;
    }
  }
}
.upload-avatar-wrapper{
  margin-right: 50px;

  .upload-avatar{
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    width: 182px;
    height: 182px;
    line-height: 182px;
    text-align: center;
    position: relative;

    .iconfont{
      font-size: 48px;
      color: #8c939d;
    }

    input[type=file]{
      display:none;
    }

    .another-choice{
      position: absolute;
      bottom: -35px;
      left: 50%;
      height: 20px;
      line-height: 20px;
      transform: translateX(-50%);
    }

    img{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      z-index: 1;
    }
  }
}
.preview-avatar{
  margin-left: 50px;
  margin-top: 30px;

  .preview-container{
    width: 96px;
    height: 96px;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid #e6eaf0;
    background-size: cover;

    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  span{
    display: block;
    margin-top: 20px;
    font-size: 12px;
    color: #99a2aa;
    text-align: center;
  }
}
</style>


