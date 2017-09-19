# bi.border

#### 上下的高度固定/左右的宽度固定，中间的高度/宽度自适应

{% method %}
[source](https://jsfiddle.net/fineui/qtdsdegp/)

{% common %}
```javascript
BI.createWidget({
    type: 'bi.border',
    element: "#wrapper",
    items: {
        north: {
            el: {type: "bi.label"},
            height: 30,
            top: 20,
            left: 20,
            right: 20
        },
        south: {
            el: {type: "bi.label"},
            height: 50,
            bottom: 20,
            left: 20,
            right: 20
        },
        west: {
            el: {type: "bi.label"},
            width: 200,
            left: 20
        },
        east: {
            el: {type: "bi.label"},
            width: 300,
            right: 20
        },
        center: {el: {type: "bi.label"}}
    }
});

```

{% endmethod %}


## API
##### 基础属性

| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| items | 子控件对象     |    object | north,east,west,south,center | [ ] | 

---