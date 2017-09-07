# bi.grid_view

## 可以合并单元格，指定行列可以删除看不见的元素,基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/fkntzLq5/)

{% common %}
```javascript

BI.createWidget({
    type: "bi.grid_view",
    width: 400,
    height: 300,
    estimatedRowSize: 30,
    estimatedColumnSize: 100,
    items: [],
    scrollTop: 100,
    rowHeightGetter: function () {
        return 30;
    },
    columnWidthGetter: function () {
        return 100;
    }
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 子组件数组 | array | —  | [ ] |
| overflowX | 是否显示横向滚动条| boolean | true,false | true |
| overflowY | 是否显示纵向滚动条 | boolean | true,false | true |
| overscanColumnCount| 超出可视范围区域预加载多少列 | number|— | 0 |
| overscanRowCount| 超出可视范围区域预加载多少行 | number | — | 0 |
| width | 行宽，必设 |number| — | —  |
| height | 列宽，必设 | number | —| — |
| rowHeightGetter| 每格行宽 |number,function | —| function  |
| columnWidthGetter| 每格列宽 | number,function |— | function |
| estimatedColumnSize| 预估行宽，columnWidthGetter为function时必设 |number,function |— | function  |
| estimatedRowSize | 预估列宽，rowHeightGetter为function时必设 | number,function | —| function |
| scrollLeft | 滚动条相对于左边的偏移 | number | — | 0 |
| scrollTop |  滚动条相对于顶部的偏移 | number |  —|0 |




## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| setScrollLeft | 设置滚动条相对于左边的偏移 | scrollLeft|
| setScrollTop | 设置滚动条相对于顶部的偏移 | scrollTop |
| setOverflowX | 设置是否显示横向滚动条 | b |
| setOverflowY | 设置是否显示横向滚动条 | b|
| getScrollLeft | 获取滚动条相对于左边的偏移 | —|
| getScrollTop | 获取滚动条相对于顶部的偏移 | — |
| getMaxScrollLeft | 获取滚动条相对于左边的最大偏移 | — |
| getMaxScrollTop | 获取滚动条相对于顶部的最大偏移 |—|
| setEstimatedColumnSize | 设置列宽 |width|
| setEstimatedRowSize | 设置行宽 | height |
| restore | 还原列表设置 | — |
| populate | 刷新列表 | items |

## 事件
| 事件     | 说明                           |  回调参数
| :------ |:------------- |:----------|
|BI.CollectionView.EVENT_SCROLL|    滚动时触发的事件 | {scrollLeft: scrollLeft, scrollTop: scrollTop} |


---


