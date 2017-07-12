


Demo.AdaptiveArrangement=BI.inherit(BI.Widget,{
    props:{
        baseCls:"demo-adaptive-arrangement"
    },

    render:function(){
         return{
             type:"bi.adaptive_arrangement",
             items:[]
         }
    }
})

BI.shortcut("demo.adaptive_arrangement",Demo.AdaptiveArrangement)