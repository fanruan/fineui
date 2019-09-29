/*
 * 给jQuery.Event对象添加的工具方法
 */
BI.$.extend(BI.$.Event.prototype, {
    // event.stopEvent
    stopEvent: function () {
        this.stopPropagation();
        this.preventDefault();
    }
});