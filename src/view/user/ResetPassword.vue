<template>
  <div class="change-password">
    <div class="change-password__steps">
      <div class="pul-steps">
        <div class="pul-step is-horizontal">
          <div class="pul-step__hd">
            <div class="pul-step__icon">
              <!--TODO-->
            </div>
            <div class="pul-step__line"></div>
          </div>
          <div class="pul-step-bd"></div>
        </div>
        <div class="pul-step"></div>
        <div class="pul-step"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss">
.change-password{
  background-color: #fff;
  min-height: 600px;
  overflow: hidden;
  position: relative;
}
.change-password__steps{
  background-color: #f5f5f5;
  height: 80px;
  padding: 0 10%;
  margin: 0 auto;
}
.pul-steps{
  display: flex;

  .pul-step{
    flex: 1;
    flex-basis: 200px;
    display: inline-block;
    position: relative;

    &.is-success{
      color: $color-base;
      border-color: $color-base;
    }

    &.is-process{
      color: #303133;
      border-color: #303133;
    }

    &.is-await{
          color: #c0c4cc;
    border-color: #c0c4cc;
    }

    &.is-horizontal{

      .pul-step__line{
        height: 2px;
        top: 11px;
        left: 0;
        right: 0;
      }
    }

    &__icon{
      box-sizing: border-box;
      background: #fff;
      border-radius: 50%;
      border: 2px solid;
      border-color: inherit;
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 14px;
      transition: .15s ease-out;
      z-index: 1;
    }


    &__line{
      position: absolute;
      border-color: inherit;
      background-color: #c0c4cc;
    }
  }
}
</style>


