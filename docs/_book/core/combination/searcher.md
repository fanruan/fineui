# bi.searcher

## 搜索逻辑控件,[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/k6s24et1/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.searcher",
    element:"#wrapper",
    adapter: {
      getItems: function () {
        return [{
                   type: "bi.label",
                   value: "张三"
                 }]
      }
    },
    popup: {
               type: "bi.button_group",
               cls: "bi-border",
               items: items,
               layouts: [{
                 type: "bi.vertical"
               }],
    },
    masker: false
  })



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| hgap    | 效果相当于容器左右padding值    |    number  |  —|  0  |
| vgap    | 效果相当于容器上下padding值    |    number  | — |  0  |
| lgap    | 效果相当于容器left-padding值   |    number  |  —|  0  |
| rgap    | 效果相当于容器right-padding值  |    number  | — |  0  |
| tgap    | 效果相当于容器top-padding值    |    number  |  —|  0  |
| bgap    | 效果相当于容器bottom-padding值 |    number  |  —|  0  |
| chooseType | 选择类型 | const | | CHOOSE_TYPE_SINGLE |
| isDefaultInit | 是否默认初始化子节点 |boolean | true,false | false |
| isAutoSearch | 是否自动搜索 |boolean | true,false | true |
| isAutoSync | 是否自动同步数据, 即是否保持搜索面板和adapter面板状态值的统一 |boolean | true,false | true |
| onSearch | isAutoSearch为false时启用 | function(op.callback) | — | —|
| el | 开启弹出层的元素 | object | —  | {type: "bi.search_editor"}|
| popup | 弹出层 | object | — |{type: "bi.searcher_view"}|
| adapter | 弹出层显示的位置元素 | object | —| null| 
| masker | masker层 |  object | — | {offset: {}}|

## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| populate | 刷新列表 | result, searchResult, keyword |
| setValue | 设置value值 | value |
| getValue | 获取被选中的值 |—|
| empty| 清空组件|—|
| destroy| 销毁组件|—|
| adapter | 搜索列表位置 | — |
| doSearch | 开始搜索 | — | 
| stopSearch | 停止搜索  | —|
| isSearching | 是否正在搜索 | —|
| isViewVisible | 组件是否可见 | —|
| getView | 获取搜索列表栏 | —|
| hasMatched | 是否匹配 | —|
| adjustHeight | 调整高度 | —|
| adjustView| 调整搜索列表栏| —|
| getKeyword | 获取搜索关键词| —|
| getKeywords | 获取搜索关键词数组| —|


## 事件方法

| 事件名称| 说明| 回调参数 | 
| :------ |:-------------  | :-----
| EVENT_START | 开始搜索 | —|
| EVENT_STOP | 停止搜索 |  —|
| EVENT_PAUSE | 暂停搜索 | —|
| EVENT_SEARCHING | 搜索中| —|
| EVENT_AFTER_INIT | 初始化之后 | —|

## 事件
| 事件     | 说明                |
| :------ |:------------- |
|BI.Searcher.EVENT_CHANGE | 搜索结果面板发生改变触发   |
|BI.Searcher.EVENT_START |  开始搜索触发          |
|BI.Searcher.EVENT_STOP |  停止搜索触发(搜索框为空)   |
|BI.Searcher.EVENT_PAUSE |  搜索暂停触发(搜索文本以空白字符结尾)  |
|BI.Searcher.EVENT_SEARCHING |  正在搜索时触发 |
|BI.Searcher.EVENT_AFTER_INIT | 搜索结果面板初始化完成后触发 |

---


