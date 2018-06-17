const _required = Symbol('_required');
const _pattern = Symbol('_pattern');
const _minlength = Symbol('_minlength');
const _maxlength = Symbol('_maxlength');

class Validator {
  constructor(rules = {}){
    this.valid = false; // 指定字段是否通过验证
    this.touched = false; //指定元素获得焦点时返回true,否则返回true
    this.modified = false; //元素值和初始值不同时返回true，否则返回false
    this.errors = {}; //错误信息
    this.rules = {}; // 规则
    this.message = '';
    this.merge(rules);
  }
  merge(obj){
    for (let key in obj) {
      if (key == 'required' && obj[key]['rule']) {
        this[key] = false;
        this.rules[key] = obj[key]['rule'];
        this.errors[key] = obj[key]['message'];
      }
      if (key == 'pattern' && obj[key]['rule'] instanceof RegExp) {
        this[key] = false;
        this.rules[key] = obj[key]['rule'];
        this.errors[key] = obj[key]['message'];
      }
      if (key == 'minlength' && typeof obj[key]['rule'] == 'number') {
        this[key] = false;
        this.rules[key] = obj[key]['rule'];
        this.errors[key] = obj[key]['message'];
      }
      if (key == 'maxlength' && typeof obj[key]['rule'] == 'number') {
        this[key] = false;
        this.rules[key] = obj[key]['rule'];
        this.errors[key] = obj[key]['message'];
      } 
    }
  }
  validate(val){
    if (this.rules.required) {
      this.required = this[_required](val);
    }
    if (this.rules.pattern) {
      this.pattern = this[_pattern](val, this.rules['pattern']);
    }
    if (this.rules.minlength) {
      this.minlength = this[_minlength](val, this.rules['minlength']);
    }
    if (this.rules.maxlength) {
      this.maxlength = this[_maxlength](val, this.rules['maxlength']);
    }

    let flag = true;
    for (let key in this.rules) {
      if (!this[key]) {
        flag = false;
        this.message = this.errors[key];
        break;
      }
    }
    this.valid = flag;
  }
  /*私有方法*/
  [_required] (val) {
    if (val === undefined) return false;
    if (typeof val == 'string' && val.length === 0) return false;
    if (typeof val == 'number' && val.toString().length === 0) return false;
    return true;
  }

  [_pattern] (val, pat) {
    if (!pat instanceof RegExp) { return false }

    let match = pat.test(val);
    return match;
  }
  /**
   * minlength
   * This function validate whether the minimum length.(only for string or Array)
   */
  [_minlength] (val, min) {
    if (typeof val === 'string') {
      return isInteger(min, 10) && val.length >= parseInt(min, 10)
    } else if (Array.isArray(val)) {
      return val.length >= parseInt(min, 10)
    } else {
      return false
    }
  }

    /**
   * maxlength
   * This function validate whether the maximum length.
   */
  [_maxlength] (val, max) {
    if (typeof val === 'string') {
      return isInteger(max, 10) && val.length <= parseInt(max, 10)
    } else if (Array.isArray(val)) {
      return val.length <= parseInt(max, 10)
    } else {
      return false
    }
  }

}
/**
 * isInteger
 * This function check whether the value of the string is integer.
 */
function isInteger (val) {
  return /^(-?[1-9]\d*|0)$/.test(val)
}

export default Validator;