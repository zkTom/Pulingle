export function animate(obj, css, interval, speedFactor, func) {
  clearInterval(obj.timer);
  function getStyle(obj, arr) {
    if (obj.currentStyle) {
      return obj.currentStyle[arr];    //针对ie
    } else {
      return document.defaultView.getComputedStyle(obj, null)[arr];
    }
  }
  obj.timer = setInterval(function () {
    var flag = true;
    for (var prop in css) {
      var cur = 0;
      cur = parseInt(getStyle(obj, prop));
      var speed = (css[prop] - cur) * speedFactor;
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
      if (cur != css[prop])
        flag = false;
      if (prop == "opacity") {
        obj.style.filter = "alpha(opacity : '+(cur + speed)+' )";
        obj.style.opacity = (cur + speed) / 100;
      }
      else
        obj.style[prop] = cur + speed + "px";
    }
    if (flag) {
      clearInterval(obj.timer);
      if (func)
        func();
    }
  }, interval);
}

export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};


export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};
