/**
 * author: young
 * createdDate: 2018/12/18
 * description: 实现先loading 然后再渲染，解决beforeInit中loading无效
 * 继承此类，你需要明确，你的页面是根据动态请求后的结果来渲染的
 * 使用：1、在子类中使用loadedRender代替render方法；2、请求数据放到reqInitData中
 */
BI.LoadingPane = BI.inherit(BI.Pane, {

    _mount: function () {
        BI.Pane.superclass._mount.apply(this, arguments);
        if (this.isMounted()) {
            this.loading();
            this.reqInitData(BI.bind(this.__loaded, this));
        }
    },

    render: function () {
        return {
            type: "bi.default"
        };
    },

    /**
     * 子类用loadedRender代替原先的render方法
     */
    loadedRender: function () {
        return {
            type: "bi.default"
        };
    },

    reqInitData: function (callback) {
        BI.isFunction(callback) && callback();
    },

    __loaded: function () {
        this.loaded();
        BI.createWidget(this.loadedRender(), {
            element: this
        }, this);
    }
});