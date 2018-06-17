var  EventUtil={
    addHandler:function (ele,type,handler) {
        if(ele.addEventListener){
            ele.addEventListener(type,handler,false);
        }else if(ele.attachEvent){
            ele.attachEvent('on'+type,handler);
        }else {
            ele["on"+type]=handler;
        }
    },
    removeHandler:function (ele, type, handler) {
        if(ele.removeEventListener){
            ele.removeEventListener(type,handler,false);
        }else if(ele.detachEvent){
            ele.detachEvent('on'+type,handler);
        }else {
            ele["on"+type]=null;
        }
    },
    getEvent:function (event) {
        return event?event:window.event;
    },
    getTarget:function (event) {
        return event.target ||event.srcElement;
    },
    preventDefault:function (event) {
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPropagation:function (event) {
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelable=true;
        }
    }
}