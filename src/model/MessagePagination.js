import _ from 'lodash';
import Pagination from  './Pagination'

export default class MessagePagination extends Pagination{
  constructor(...args){
    super(...args);
  }

  // 合并结果集
  merge(newPage) {
    if(!(newPage instanceof MessagePagination)) throw new Error('newPage必须为MessagePagination的实例！');

    for (let name in this) {
      if (newPage[name] === undefined) continue;
      else if (name === 'resultList')  this.resultList = newPage.resultList.concat(this.resultList || []);
      else this[name] = newPage[name];
    }
  }

  static as(o) {
    return _.assign(new MessagePagination(), o);
  }
}