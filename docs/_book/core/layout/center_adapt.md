# bi.center_adapt

#### 自适应左右垂直居中布局

{% method %}
[source](https://jsfiddle.net/fineui/7bsxw7u5/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.center_adapt",
    element: "#wrapper",
    hgap: 10,
    items: [{
        type: "bi.label",
        text: "Center Adapt 1",
        cls: "layout-bg1",
        height: 30
    }, {
        type: "bi.label",
        text: "Center Adapt 2",
        cls: "layout-bg2",
        height: 30
    }]
})



```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| columnSize | 列宽     |    array | — | [ ] |

---