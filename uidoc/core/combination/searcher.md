# bi.searcher

## 搜索逻辑控件,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/k6s24et1/)

{% common %}
```javascript

var items = [{
    type: "bi.label",
    value: "张三"
  }, {
    type: "bi.label",
    value: "李四"
  }];
  var popup = BI.createWidget({
    type: "bi.button_group",
    cls: "bi-border",
    items: items,
    layouts: [{
      type: "bi.vertical"
    }]
  });

BI.createWidget({
    type: "bi.searcher",
    element:"#wrapper",
    listeners: [{
      eventName: BI.Searcher.EVENT_STOP,
      action: function () {
        popup.populate(items)
      }
    }, {
      eventName: BI.Searcher.EVENT_PAUSE,
      action: function () {
        popup.populate(items)
      }
    }],
    adapter: {
      getItems: function () {
        return items
      }
    },
    popup: popup,
    masker: false
  })



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于容器左右padding值    |    number  |  |  0  |
| vgap    | 效果相当于容器上下padding值    |    number  |  |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  |  0  |
| rgap    | 效果相当于容器right-padding值  |    number  |  |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  |  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  |  |  0  |
| chooseType | 选择类型 | const | | CHOOSE_TYPE_SINGLE |
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| isAutoSearch | 是否自动搜索 |boolean | true,false | true |
| isAutoSync | 是否自动同步数据, 即是否保持搜索面板和adapter面板状态值的统一 |boolean | true,false | true |
| onSearch | isAutoSearch为false时启用 | function(op.callback) | | |
| el | 开启弹出层的元素 | object | —  | {type: "bi.search_editor"}|
| popup | 弹出层 | object | — |{type: "bi.searcher_view"}|
| adapter | | | | null| 
| masker | masker层 | | — | {offset: {}}|

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | result, searchResult, keyword |
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|



---


