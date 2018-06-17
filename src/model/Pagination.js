import _ from 'lodash';

export default class Pagination {
  constructor(currentPage = 1, pageSize = 5) {
    this.pageSize = pageSize;// 当前页的数量
    this.currentPage = currentPage; // 当前页码

    this.resultList = [];// 结果集
    this.pageNum = 1; // 总条数
  }

  // 合并结果集
  merge(newPage) {
    if(!(newPage instanceof Pagination)) throw new Error('newPage必须为Pagination的实例！');

    for (let name in this) {
      if (newPage[name] === undefined) continue;
      else if (name === 'resultList') this.resultList = this.resultList.concat(newPage.resultList || []);
      else this[name] = newPage[name];
    }
  }

  // 
  // 可以传自己想传的参数
  static as(o) {
    return _.assign(new Pagination(), o);
  }
}