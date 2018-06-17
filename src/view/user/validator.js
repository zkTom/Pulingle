const phoneRule = {
    required:{ rule: true, message: '手机号不能为空'},
    pattern: { rule: /^1[35784]\d{9}$/, message: '手机号格式错误'}
}
const passwordRule = {
  required:{ rule: true, message: '密码不能为空'},
  minlength: {rule: 6, message: '密码最少6位'},
  maxlength: {rule: 16, message: '密码最多16位'},
  pattern: { rule: /^[a-zA-Z0-9_-]{6,16}$/, message: '密码格式错误'}
  ///^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/
}
const authCodeRule = {
  required:{ rule: true, message: '验证码不能为空'},
  pattern: { rule: /^\d{6}$/, message: '验证码格式错误'}
}
const captchaRule = {
  required:{ rule: true, message: '验证码不能为空'},
  pattern: { rule: /^[A-Za-z\d]{4}$/, message: '验证码格式错误'}
}

export {
  phoneRule, passwordRule, authCodeRule, captchaRule
};
// const phone = {
//   valid: true,
//   rules: {
//     required: true,
//     pattern: /^\d{4}$/
//   },
//   errors:{
//     required: 'message',
//     pattern: 'message'
//   },
//   message: []
// }
// 'form.account'(val){
//   let rules = this.phoneValidator.rules;
//   let errors = this.phoneValidator.errors;
//   this.phoneValidator.message = [];
//   if (rules['required'] && validator.isEmpty(val)) {
//     this.phoneValidator.valid = false;
//     this.phoneValidator.message.push(errors['required']);
//     return;
//   } else if (rules['pattern'] && !validator.pattern(val, rules['pattern'])) {
//     this.phoneValidator.valid = false;
//     this.phoneValidator.message.push(errors['pattern']);
//     return;
//   } else {
//     this.phoneValidator.valid = true;
//     this.phoneValidator.message = [];
//   }
// },
