/*
 * 给jQuery.Event对象添加的工具方法
 */
$.extend($.Event.prototype, {
    // event.stopEvent
    stopEvent: function () {
        this.stopPropagation();
        this.preventDefault();
    }
});