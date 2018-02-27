/**
 *
 * Created by GUY on 2017/09/18.
 * @class BI.RichEditorParamAction
 * @extends BI.Widget
 */
BI.RichEditorParamAction = BI.inherit(BI.RichEditorAction, {
    _defaultConfig: function () {
        return BI.extend(BI.RichEditorParamAction.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.RichEditorParamAction.superclass._init.apply(this, arguments);
    },

    _createBlankNode: function () {
        return $("<span>").html("&nbsp;");
    },

    _addBlank: function ($param) {
        var o = this.options;
        var instance = o.editor.selectedInstance;
        var next = $param.next();
        if (next.length === 0) {
            var nextNode = this._createBlankNode();
            $param.after(nextNode);
            instance.setFocus(nextNode[0]);
        } else {
            instance.setFocus(next[0]);
        }
    },

    addParam: function (param) {
        var o = this.options;
        var instance = o.editor.instance;
        var image = new Image();
        var attrs = BI.DOM.getImage(param);
        image.src = attrs.src;
        image.alt = param;
        image.style = attrs.style;
        instance.getElm().element.append(image);
        this._addBlank($(image));
    }
});

// /**
//  *
//  * Created by GUY on 2017/09/18.
//  * @class BI.RichEditorParamAction
//  * @extends BI.Widget
//  */
// BI.RichEditorParamAction = BI.inherit(BI.RichEditorAction, {
//     _defaultConfig: function () {
//         return BI.extend(BI.RichEditorParamAction.superclass._defaultConfig.apply(this, arguments), {});
//     },
//
//     _init: function () {
//         BI.RichEditorParamAction.superclass._init.apply(this, arguments);
//     },
//
//     _isParam: function (sel) {
//         return sel.attr("data-type") === "param";
//     },
//
//     _createBlankNode: function () {
//         return $("<span>").html("&nbsp;");
//     },
//
//     _addBlank: function ($param) {
//         var o = this.options;
//         var instance = o.editor.selectedInstance;
//         var next = $param.next();
//         if (next.length === 0 || this._isParam(next)) {
//             var preNode = this._createBlankNode();
//             var nextNode = this._createBlankNode();
//             $param.before(preNode);
//             $param.after(nextNode);
//             instance.setFocus(nextNode[0]);
//         } else {
//             instance.setFocus(next[0]);
//         }
//     },
//
//     _get$Sel: function () {
//         var o = this.options;
//         var instance = o.editor.selectedInstance;
//         var sel = $(instance.selElm());
//         if (sel[0].nodeType === 3 && this._isParam(sel.parent())) {
//             sel = sel.parent();
//         }
//         return sel;
//     },
//
//     addParam: function (param) {
//         var o = this.options;
//         var sel = this._get$Sel();
//         var $param = $("<span>").attr({
//             "data-type": "param",
//             "data-value": param
//         }).css({
//             color: "white",
//             backgroundColor: "#009de3",
//             padding: "0 5px"
//         }).text(param).keydown(function (e) {
//             if (e.keyCode === BI.KeyCode.BACKSPACE || e.keyCode === BI.KeyCode.DELETE) {
//                 $param.destroy();
//             }
//             e.stopEvent();
//             return false;
//         });
//         var wrapper = o.editor.instance.getElm().element;
//         if (wrapper.find(sel).length <= 0) {
//             wrapper.append($param);
//         } else {
//             sel.after($param);
//         }
//         this._addBlank($param);
//     },
//
//     keydown: function (e) {
//         var o = this.options;
//         var sel = this._get$Sel();
//         if (e.keyCode === 229) {// 中文输入法
//             if (this._isParam(sel)) {
//                 this._addBlank(sel);
//                 e.stopEvent();
//                 return false;
//             }
//         }
//         if (BI.Key[e.keyCode] || e.keyCode === BI.KeyCode.TAB || e.keyCode === BI.KeyCode.ENTER || e.keyCode === BI.KeyCode.SPACE) {
//             if (this._isParam(sel)) {
//                 e.stopEvent();
//                 return false;
//             }
//         }
//         if (e.keyCode === BI.KeyCode.BACKSPACE || e.keyCode === BI.KeyCode.DELETE) {
//             if (this._isParam(sel)) {
//                 sel.destroy();
//                 e.preventDefault();
//                 return false;
//             }
//         }
//     },
//
//     key: function (e) {
//     }
// });

