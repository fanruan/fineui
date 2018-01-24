/**
 * Created by Young's on 2017/3/10.
 */
BI.RelationViewRegionContainer = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RelationViewRegionContainer.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-region-container",
            width: 210
        });
    },

    _init: function () {
        BI.RelationViewRegionContainer.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.region = BI.createWidget({
            type: "bi.relation_view_region",
            value: o.value,
            width: o.width,
            header: o.header,
            text: o.text,
            handler: o.handler,
            disabled: o.disabled,
            items: o.items,
            isView: o.isView,
            keyword: o.keyword
        });
        this.region.on(BI.RelationViewRegion.EVENT_PREVIEW, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_PREVIEW, v);
        });
        this.region.on(BI.RelationViewRegion.EVENT_HOVER_IN, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_HOVER_IN, v);
        });
        this.region.on(BI.RelationViewRegion.EVENT_HOVER_OUT, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_HOVER_OUT, v);
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.region],
            width: this.region.getWidth(),
            height: this.region.getHeight()
        });
    },

    getWidth: function () {
        return this.region.getWidth();
    },

    getHeight: function () {
        return this.region.getHeight();
    },

    // 获取上方开始划线的位置
    getTopLeftPosition: function () {
        return this.region.getTopLeftPosition();
    },

    getTopRightPosition: function () {
        return this.region.getTopRightPosition();
    },

    getBottomPosition: function () {
        return this.region.getBottomPosition();
    },

    getLeftPosition: function () {
        return this.region.getLeftPosition();
    },

    getRightPosition: function () {
        return this.region.getRightPosition();
    },

    setValue: function (v) {
        this.region.setValue(v);
    },

    toggleRegion: function (v) {
        v === true ? this.region.element.fadeIn() : this.region.element.fadeOut();
    },

    setPreviewSelected: function (v) {
        this.region.setPreviewSelected(v);
    }
});
BI.RelationViewRegionContainer.EVENT_HOVER_IN = "RelationViewRegion.EVENT_HOVER_IN";
BI.RelationViewRegionContainer.EVENT_HOVER_OUT = "RelationViewRegion.EVENT_HOVER_OUT";
BI.RelationViewRegionContainer.EVENT_PREVIEW = "RelationViewRegion.EVENT_PREVIEW";
BI.shortcut("bi.relation_view_region_container", BI.RelationViewRegionContainer);