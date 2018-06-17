<template>
  <div class="pagination-container">
    <!-- <div class="page-info">
      <span>共计&nbsp;{{total}}&nbsp;条记录，共计&nbsp;{{pages}}&nbsp;页,&nbsp;&nbsp;每页显示
        <select name="" id="pagesize" @change="chooseSize($event)">
          <option :value="size" :key="size" v-for="size in pageSizes">{{size}}</option>
        </select>
        条
      </span>
    </div> -->
    <div class="page-bar">
      <ul class="pagination">
        <li class="first" :class="{'disabled':!hasPrevPage}" @click='toFirst'>
          <a href="javascript:void(0)">首页</a>
        </li>
        <li class="prev" :class="{'disabled':!hasPrevPage}" @click="toPrev">
          <a href="javascript:void(0)">上一页</a>
        </li>
        <li v-for="pager in pagers" :class="{'active': index == pager}" :key="pager"  @click="go(pager)">
          <a href="javascript:void(0);">{{pager}}</a>
        </li>
        <li class="next" @click="toNext" :class="{'disabled':!hasNextPage}">
          <a href="javascript:void(0)">下一页</a>
        </li>
        <li class="last" @click='toLast' :class="{'disabled':!hasNextPage}">
          <a href="javascript:void(0)">尾页</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  data() {
    let data = {};
    
    data.index = this.pageIndex;
    data.limit = this.pageSize;
    data.size = this.total;
    return data;
  },
  props: {
    pageIndex: { // 当前页码
      type: Number,
      default: 1
    },
    total: { // 总条数
      type: Number,
      default: 1
    },
    pageSize: { //每页条数
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50]
    }
  },
  computed: {
    hasNextPage(){
      return this.index < this.pages;
    },
    hasPrevPage(){
      return this.index > 1;
    },
    pages() { // 计算总页数
      let pages = Math.ceil(this.size / this.limit);
      if (pages == 0){
        pages = 1;
      }
      return pages;
    },
    pagers() { // 计算页码条总数
      let index = this.index;
      let pages = this.pages;
      let count = 10;
      const offset = Math.floor(count / 2);
      let start = index - (offset - 1);
      let end = index + offset;

      if (start < 1) {
        start = 1;
      } else if (start > (pages - count)) {
        start = pages - count;
      }
      if (end > pages) {
        end = pages;
      } else if (pages > count && end < count) {
        end = count;
      }

      const arr = [];

      for (let i = start; i <= end;i++) {
        arr.push(i);
      }

      return arr;
    }
  },
  methods: {
    toPrev() {
      let index = this.index;

      if (index > 1) {
          this.go(index - 1);
      }
    },
    toNext() {
      let index = this.index;
      let pages = this.pages;

      if (index < pages) {
          this.go(index + 1)
      }
    },
    toLast(){
      if (this.index != this.pages) {
          this.go(this.pages)
      }
    },
    toFirst() {
      if (this.index != 1) {
          this.go(1)
      }
    },
    go (page) {
      if (this.index !== page) {
          this.index = page
          //父组件通过change方法来接受当前的页码
          this.$emit('indexChange', this.index)
      }
    },
    chooseSize(event){
      let size = Number(event.target.value);
      this.limit = size;
      if (this.size == 0) return;
      this.$emit('sizeChange', size)
    }
  },
  watch: {
    pageIndex(val) {
      this.index = val || 1;
    },
    pageSize(val) {
      this.limit = val || 10;
    },
    total(val) {
      this.size = val || 1;
    }
  }
}
</script>

<style lang="scss">
.pagination-container{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  .page-info {
    display: flex;
    align-items: center;
    font-size: 12px;
  }

  
  .pagination{
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    font-size: 12px;

    li{
      position: relative;

      a,span {
        padding-top: 4px;
        padding-bottom: 4px;
        background: #fafafa;
        padding: 6px 12px 4px 12px;
        line-height: 1.42857143;
        color: #666;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid #ddd ;
      }

      a:focus, 
      a:hover, 
      span:focus, 
      span:hover {
        z-index: 3;
        color: #666;
        background-color: #eee;
        border-color: #ddd;
      }
    }

    .active>a,
    .active>a:focus, 
    .active>a:hover,
    .active>span,
    .active>span:focus,
    .active>span:hover {
      z-index: 2;
      color: #fff;
      cursor: default;
      background-color: #337ab7;
      border-color: #337ab7;
    }

    .disabled>a, 
    .disabled>a:focus, 
    .disabled>a:hover, 
    .disabled>span, 
    .disabled>span:focus,
    .disabled>span:hover{
      color: #777;
      cursor: not-allowed;
      background-color: #fff;
      border-color: #ddd;
    }
  }

}
</style>

