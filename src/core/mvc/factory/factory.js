/**
 * MVC工厂
 * guy
 * @class BI.Factory
 */
BI.Factory = {
    createView : function(url, viewFunc, mData, vData, context){
        var modelFunc = viewFunc.replace(/View/, "Model");
        if(modelFunc === viewFunc || !_.isFunction(eval(modelFunc))){
            console.warn("没有对应的Model:" + modelFunc + "使用默认的Model方式");
            modelFunc = "BI.Model";
        }
//        try {
            var model = new (eval(modelFunc))(_.extend({}, mData, {
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