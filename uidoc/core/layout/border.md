# bi.border

#### 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应

{% method %}
[source](https://jsfiddle.net/fineui/qtdsdegp/)

{% common %}
```javascript

Demo = {};
Demo._createNorth = function(){
    return BI.createWidget({
        type: "bi.label",
        text: "North",
        cls: "layout-bg1",
        height: 30
    })
};
Demo._createWest = function(){
    return BI.createWidget({
        type: "bi.center",
        cls: "layout-bg2",
        items:[{
            type: "bi.label",
            text: "West",
            whiteSpace: "normal"
        }]
    })
};

Demo._createCenter = function(){
    return BI.createWidget({
        type: "bi.center",
        cls: "layout-bg3",
        items: [{
            type: "bi.label",
            text: "Center",
            whiteSpace: "normal"
        }]
    })
};

Demo._createEast =  function(){
    return BI.createWidget({
        type: "bi.center",
        cls: "layout-bg5",
        items: [{
            type: "bi.label",
            text: "East",
            whiteSpace: "normal"
        }]
    })
};

Demo._createSouth = function(){
    return BI.createWidget({
        type: "bi.label",
        text: "South",
        cls: "layout-bg6",
        height: 50
    })
};

BI.createWidget({
    type: 'bi.border',
    element: "#wrapper",
    cls: "",
    items: {
        north: {
            el: Demo._createNorth(),
            height: 30,
            top: 20,
            left: 20,
            right: 20
        },
        south: {
            el: Demo._createSouth(),
            height: 50,
            bottom: 20,
            left: 20,
            right: 20
        },
        west: {
            el: Demo._createWest(),
            width: 200,
            left: 20
        },
        east: {
            el: Demo._createEast(),
            width: 300,
            right: 20
        },
        center: Demo._createCenter()
    }
});




```

{% endmethod %}


## API
##### 基础属性

| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| items | 子控件对象     |    object | north,east,west,south,center |  | |


---