# bi.grid_table

### 列表展示的table，继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/a936vcvj/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.grid_table",
  element: 'body',
  width: 600,
  height: 500,
  isResizeAdapt: true,
  isNeedResize: true,
  isNeedFreeze: true,
  freezeCols: [0, 1],
  columnSize: [50,50,200,250,400],
  items: items,
  header: header
});
```

{% endmethod %}

## 参数设置
| 参数               | 说明      | 类型      | 默认值   |
| ---------------- | ------- | ------- | ----- |
| isNeedFreeze     | 是否需要冻结  | boolean | false |
| freezeCols       | 冻结列     | array   | []    |
| columnSize       | 单元格宽度集合 | array   | []    |
| headerRowSize    | 表头高度    | number  | 25    |
| rowSize          | 普通单元格高度 | number  | 25    |
| regionColumnSize | 列项间的    | array   | []    |
| header           | 表头      | array   | []    |
| items            | 子组件     | array   | []    |

## 方法
| 方法名                      | 说明          | 参数         |
| ------------------------ | ----------- | ---------- |
| setWidth                 | 设置宽度        | width      |
| setHeight                | 设置高度        | height     |
| getRegionSize            | 获取间隙大小      | —          |
| setColumnSize            | 设置列宽        | columnSize |
| getColumnSize            | 得到列宽        | —          |
| setRegionColumnSize      | 设置列项之间的间隙   | columnSize |
| getRegionColumnSize      | 获得列项之间的间隙   | —          |
| setVerticalScroll        | 设置纵向滚动距离    | scrollTop  |
| setLeftHorizontalScroll  | 设置左到右横向滚动距离 | scrollLeft |
| setRightHorizontalScroll | 设置右往左横向滚动距离 | scrollLeft |
| getVerticalScroll        | 获取纵向滚动距离    | —          |
| getLeftHorizontalScroll  | 获取左到右横向滚动距离 | —          |
| getRightHorizontalScroll | 获取右往左横向滚动距离 | —          |
| populate                 | 刷新内容        | rows       |
| restore                  | 储存          | —          |

------

