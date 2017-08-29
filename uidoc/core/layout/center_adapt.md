# bi.center_adapt

#### 自适应左右垂直居中布局

{% method %}
[source](https://jsfiddle.net/fineui/7bsxw7u5/)

{% common %}
```javascript
Demo = {};
Demo.CenterAdapt = BI.inherit(BI.Widget, {
    props: {
        baseCls: "demo-absolute"
    },
    render: function () {
        return {
            type: "bi.grid",
            columns: 1,
            rows: 2,
            items: [{
                column: 0,
                row: 0,
                el: this._createNoWidth()
            }, {
                column: 0,
                row: 1,
                el: this._createBottom()
            }]
        }
    },

    _createNoWidth: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            hgap: 10,
            items: [{
                type: "bi.label",
                text: "Center Adapt 1 这些label都是没有宽度的",
                cls: "layout-bg1",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 2",
                cls: "layout-bg2",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 3",
                cls: "layout-bg3",
                height: 30
            }, {
                type: "bi.label",
                text: "Center Adapt 4",
                cls: "layout-bg5",
                height: 30
            }]
        })
    },

    _createBottom: function () {
        return BI.createWidget({
            type: "bi.center_adapt",
            items: [{
                type: "bi.text_button",
                text: "这个是有宽度和高度的按钮按钮-1",
                height: "100%",
                width: 160,
                cls: "layout-bg1"
            }, {
                type: "bi.text_button",
                text: "按钮-2",
                height: 30,
                width: 100,
                cls: "layout-bg2"
            }, {
                type: "bi.text_button",
                text: "按钮-3",
                height: 30,
                width: 100,
                cls: "layout-bg3"
            }, {
                type: "bi.text_button",
                text: "按钮-4",
                height: 30,
                width: 100,
                cls: "layout-bg5"
            }]
        })
    },
});
BI.shortcut("demo.center_adapt", Demo.CenterAdapt);
BI.createWidget({
  type: 'demo.center_adapt',
  element: "#wrapper",
});



```

{% endmethod %}


## API
##### 基础属性
| 参数    | 说明                           | 类型       | 可选值 | 默认值
| :------ |:-------------                  | :-----     | :----|:----
| hgap    | 效果相当于容器左右padding值    |    number  |  |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  |  |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  |  |  0  |
| items | 子控件数组     |    array |  |  |
| columnSize | 每列宽度所组成的数组     |    array |  |  | |

---