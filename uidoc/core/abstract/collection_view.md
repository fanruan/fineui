# bi.collection_view

## CollectionView,指定行列可以删除看不见的元素 基类[BI.Widget](/core/widget.md)

{% method %}
[source](https://jsfiddle.net/fineui/cmq0b3v0/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.collection_view",
  element:"#wrapper",
  width: 400,
  height: 300,
  items: [],
  cellSizeAndPositionGetter: function (index) {
      return {
          x: index % 10 * 50,
          y: Math.floor(index / 10) * 50,
          width: 50,
          height: 50
      }
  }
});



```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| items | 子组件数组 | array |  — | [ ] |
| overflowX | 是否显示横向滚动条| boolean | true,false | true |
| overflowY | 是否显示纵向滚动条 | boolean | true,false | true |
| cellSizeAndPositionGetter | 设置每个单元格的位置坐标和宽高 | function|— | — |
| horizontalOverscanSize | 横向超出可视范围区域预加载的数量 | number | — | 0 |
| verticalOverscanSize | 纵向超出可视范围区域预加载的数量 | number | — | 0 |
| width | 行宽，必设 |number| — | —  |
| height | 列宽，必设 | number | —| — |
| scrollLeft | 滚动条相对于左边的偏移 | number | — | 0 |
| scrollTop |  滚动条相对于顶部的偏移 | number | — | 0 |


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
| restore | 还原列表设置 | — |
| populate | 刷新列表 | items |


## 事件
| 事件     | 说明                           |  回调参数 |
| :------ |:------------- |:------------------------|
|BI.GridView.EVENT_SCROLL|    滚动时触发的事件 | {scrollLeft: scrollLeft, scrollTop: scrollTop} |

---


