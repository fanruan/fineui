BI.BehaviorFactory = {
    createBehavior: function(key, options){
        var behavior;
        switch (key){
            case "highlight":
                behavior = BI.HighlightBehavior;
                break;
            case "redmark":
                behavior = BI.RedMarkBehavior;
                break;
        }
        return new behavior(options);
    }
}

/**
 * guy
 * 行为控件
 * @class BI.Behavior
 * @extends BI.OB
 */
BI.Behavior = BI.inherit(BI.OB, {
    _defaultConfig: function() {
        return BI.extend(BI.Behavior.superclass._defaultConfig.apply(this, arguments), {
            rule: function(){return true;}
        });
    },

    _init : function() {
        BI.Behavior.superclass._init.apply(this, arguments);

    },

    doBehavior: function(){

    }
});