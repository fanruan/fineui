/**
 * guy
 * 上下布局逻辑
 * 上下布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.VerticalLayoutLogic
 * @extends BI.Logic
 */
BI.VerticalLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.vertical";
        } else {
            layout = "bi.vtape";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.VerticalLayoutLogic.superclass._init.apply(this, arguments);
    }
});


/**
 * guy
 * 左右布局逻辑
 * 左右布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.HorizontalLayoutLogic
 * @extends BI.Logic
 */
BI.HorizontalLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.horizontal";
        } else {
            layout = "bi.htape";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.HorizontalLayoutLogic.superclass._init.apply(this, arguments);
    }
});

/**
 * guy
 * 表格布局逻辑
 * 表格布局的时候要考虑到是动态布局还是静态布局
 *
 * @class BI.TableLayoutLogic
 * @extends BI.OB
 */
BI.TableLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.TableLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            columns: 0,
            rows: 0,
            columnSize: [],
            rowSize: [],
            hgap: 0,
            vgap: 0,
            items: []
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        if (o.dynamic) {
            layout = "bi.table";
        } else {
            layout = "bi.window";
        }
        return {
            type: layout,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            columns: o.columns,
            rows: o.rows,
            columnSize: o.columnSize,
            rowSize: o.rowSize,
            hgap: o.hgap,
            vgap: o.vgap,
            items: o.items
        }
    },

    _init: function () {
        BI.TableLayoutLogic.superclass._init.apply(this, arguments);
    }
});

/**
 * guy
 * 左右充满布局逻辑
 *
 * @class BI.HorizontalFillLayoutLogic
 * @extends BI.Logic
 */
BI.HorizontalFillLayoutLogic = BI.inherit(BI.Logic, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalFillLayoutLogic.superclass._defaultConfig.apply(this, arguments), {
            dynamic: false,
            scrollable: null,
            scrolly: false,
            scrollx: false,
            items: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    createLogic: function () {
        var layout, o = this.options;
        var columnSize = [];
        BI.each(o.items, function (i, item) {
            columnSize.push(item.width || 0);
        });
        if (o.dynamic) {
            layout = "bi.horizontal_adapt";
        } else {
            layout = "bi.htape";
        }
        return {
            type: layout,
            columnSize: columnSize,
            scrollable: o.scrollable,
            scrolly: o.scrolly,
            scrollx: o.scrollx,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        }
    },

    _init: function () {
        BI.HorizontalFillLayoutLogic.superclass._init.apply(this, arguments);
    }
});