/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-center-layout clearfix"
        });
    },
    render: function () {
        BI.FlexCenterLayout.superclass.render.apply(this, arguments);
        this.$wrapper = $("<div>").addClass("flex-wrapper-center-layout-wrapper");
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
        return w;
    },

    _mountChildren: function () {
        var self = this;
        var frag = document.createDocumentFragment();
        var hasChild = false;
        BI.each(this._children, function (i, widget) {
            if (widget.element !== self.element) {
                frag.appendChild(widget.element[0]);
                hasChild = true;
            }
        });
        if (hasChild === true) {
            this.$wrapper.append(frag);
            this.element.append(this.$wrapper);
        }
    },

    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        w._mount();
        this.options.items.push(item);
        w.element.appendTo(this.$wrapper);
        return w;
    },

    resize: function () {
        // console.log("flex_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
$.shortcut('bi.flex_wrapper_center', BI.FlexCenterLayout);