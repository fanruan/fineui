/**
 * guy
 * 由一个元素切换到另一个元素的行为
 * @class BI.Action
 * @extends BI.OB
 * @abstract
 */
BI.Action = BI.inherit(BI.OB, {
    props: function () {
        return {
            src: null,
            tar: null
        };
    },

    actionPerformed: function (src, tar, callback) {

    },

    actionBack: function (tar, src, callback) {

    }
});

BI.ActionFactory = {
    createAction: function (key, options) {
        var action;
        switch (key) {
            case "show":
                action = BI.ShowAction;
                break;
        }
        return new action(options);
    }
};
