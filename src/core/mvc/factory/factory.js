/**
 * MVC工厂
 * guy
 * @class BI.Factory
 */
BI.Factory = {
    parsePath: function parsePath (path) {
        var segments = path.split('.');
        return function (obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                    return;
                }
                obj = obj[segments[i]];
            }
            return obj;
        }
    },
    createView : function(url, viewFunc, mData, vData, context){
        var modelFunc = viewFunc.replace(/View/, "Model");
        modelFunc = this.parsePath(modelFunc)(window);
        if(!_.isFunction(modelFunc)){
            modelFunc = BI.Model;
        }
//        try {
            var model = new (modelFunc)(_.extend({}, mData, {
                    parent: context && context.model,
                    rootURL: url
            }), {silent: true});
//        } catch (e) {
//
//        }
//        try {
        var view = new (eval(viewFunc))(_.extend({}, vData, {
            model: model,
            parent: context,
            rootURL: url
        }));
//        } catch (e) {
//
//        }
        return view;
    }
};