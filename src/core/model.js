;(function () {
    var models = {};
    BI.models = function (xtype, cls) {
        if (models[xtype] != null) {
            throw ("models:[" + xtype + "] has been registed");
        }
        models[xtype] = cls;
    };

    BI.Models = {
        getModel: function (type, config) {
            return new models[type](config);
        }
    }
})();
