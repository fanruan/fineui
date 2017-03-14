/**
 * @class BI.Logic
 * @extends BI.OB
 */
BI.Logic = BI.inherit(BI.OB, {
    createLogic: function () {
        return this.options || {};
    }
});

BI.LogicFactory = {
    Type: {
        Vertical: "vertical",
        Horizontal: "horizontal",
        Table: "table",
        HorizontalFill: "horizontal_fill"
    },
    createLogic: function (key, options) {
        var logic;
        switch (key) {
            case BI.LogicFactory.Type.Vertical:
                logic = BI.VerticalLayoutLogic;
                break;
            case BI.LogicFactory.Type.Horizontal:
                logic = BI.HorizontalLayoutLogic;
                break;
            case BI.LogicFactory.Type.Table:
                logic = BI.TableLayoutLogic;
                break;
            case BI.LogicFactory.Type.HorizontalFill:
                logic = BI.HorizontalFillLayoutLogic;
                break;
            default :
                logic = BI.Logic;
                break;
        }
        return new logic(options).createLogic();
    },

    createLogicTypeByDirection: function (direction) {
        switch (direction) {
            case BI.Direction.Top:
            case BI.Direction.Bottom:
            case BI.Direction.Custom:
                return BI.LogicFactory.Type.Vertical;
                break;
            case BI.Direction.Left:
            case BI.Direction.Right:
                return BI.LogicFactory.Type.Horizontal;
        }
    },

    createLogicItemsByDirection: function (direction) {
        var layout;
        var items = Array.prototype.slice.call(arguments, 1);
        items = BI.map(items, function (i, item) {
            if (BI.isWidget(item)) {
                return {
                    el: item,
                    width: item.options.width,
                    height: item.options.height
                }
            }
            return item;
        });
        switch (direction) {
            case BI.Direction.Bottom:
                layout = BI.LogicFactory.Type.Vertical;
                items.reverse();
                break;
            case BI.Direction.Right:
                layout = BI.LogicFactory.Type.Horizontal;
                items.reverse();
                break;
            case BI.Direction.Custom:
                items = items.slice(1);
                break;
        }
        return items;
    }
};