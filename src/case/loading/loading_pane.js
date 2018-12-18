/**
 * author: young
 * createdDate: 2018/12/18
 * description:
 */
BI.LoadingPane = BI.inherit(BI.Pane, {
    _mount: function () {
        var isMounted = BI.Pane.superclass._mount.apply(this, arguments);
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