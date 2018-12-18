/**
 * author: young
 * createdDate: 2018/12/18
 * description: 实现先loading 然后再渲染，解决beforeInit中loading无效
 * 继承此类，你需要明确，你的页面是根据动态请求后的结果来渲染的
 * 使用：1、在子类中使用loadedRender代替render方法；2、请求数据放到reqInitData中
 */
BI.LoadingPane = BI.inherit(BI.Pane, {

    _mount: function () {
        var isMounted = BI.LoadingPane.superclass._mount.apply(this, arguments);
        if (isMounted) {
            if (this.beforeInit) {
                this.__asking = true;
                this.loading();
                this.beforeInit(BI.bind(this.__loaded, this));
            }
        }
    },

    _initRender: function () {
        if (this.beforeInit) {
            this.__async = true;
        } else {
            this._render();
        }
    },

    __loaded: function () {
        this.__asking = false;
        this.loaded();
        this._render();
    }
});