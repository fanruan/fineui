/**
 * svg绘图
 *
 * Created by GUY on 2015/12/3.
 * @class BI.Svg
 * @extends BI.Widget
 */
BI.Svg = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Svg.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-svg"
        })
    },

    _init: function () {
        BI.Svg.superclass._init.apply(this, arguments);
        this.paper = Raphael(this.element[0]);

        $(this.paper.canvas).width("100%").height("100%").css({"left": "0", "top": "0"}).appendTo(this.element);

        this.top = this.paper.top;
        this.bottom = this.paper.bottom;
        this.customAttributes = this.paper.customAttributes;
        this.ca = this.paper.ca;
        this.raphael = this.paper.raphael;
    },

    add: function () {
        return this.paper.add.apply(this.paper, arguments);
    },

    path: function () {
        return this.paper.path.apply(this.paper, arguments);
    },

    image: function () {
        return this.paper.image.apply(this.paper, arguments);
    },

    rect: function () {
        return this.paper.rect.apply(this.paper, arguments);
    },

    circle: function () {
        return this.paper.circle.apply(this.paper, arguments);
    },

    ellipse: function () {
        return this.paper.ellipse.apply(this.paper, arguments);
    },

    text: function () {
        return this.paper.text.apply(this.paper, arguments);
    },

    print: function () {
        return this.paper.print.apply(this.paper, arguments);
    },


    setStart: function () {
        return this.paper.setStart.apply(this.paper, arguments);
    },

    setFinish: function () {
        return this.paper.setFinish.apply(this.paper, arguments);
    },

    setSize: function () {
        return this.paper.setSize.apply(this.paper, arguments);
    },

    setViewBox: function () {
        return this.paper.setViewBox.apply(this.paper, arguments);
    },


    getById: function () {
        return this.paper.getById.apply(this.paper, arguments);
    },

    getElementByPoint: function () {
        return this.paper.getElementByPoint.apply(this.paper, arguments);
    },

    getElementsByPoint: function () {
        return this.paper.getElementsByPoint.apply(this.paper, arguments);
    },

    getFont: function () {
        return this.paper.getFont.apply(this.paper, arguments);
    },


    set: function () {
        return this.paper.set.apply(this.paper, arguments);
    },
    remove: function () {
        return this.paper.remove.apply(this.paper, arguments);
    },
    clear: function () {
        return this.paper.clear.apply(this.paper, arguments);
    }
});
$.shortcut("bi.svg", BI.Svg);