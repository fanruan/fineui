# bi.resizable_table

### 可调整列宽的grid表格，继承BI.Widget

{% method %}
[source](https://jsfiddle.net/fineui/0e7p2ezc/)

{% common %}
```javascript
BI.createWidget({
  type: "bi.resizable_table",
  element: "body",
  columnSize: [200,200],
  items: [
    [{
      type: "bi.label",
      cls: "layout-bg1",
      text: "第一行第一列"
    }, {
      type: "bi.label",
      cls: "layout-bg2",
      text: "第一行第二列"
    }],
    [{
      type: "bi.label",
      cls: "layout-bg3",
      text: "第二行第一列"
    }, {
      type: "bi.label",
      cls: "layout-bg4",
      text: "第二行第二列"
    }]
  ] 
});
```

{% endmethod %}

## 参数设置
| 参数               | 说明        | 类型      | 默认值   |
| ---------------- | --------- | ------- | ----- |
| isNeedFreeze     | 是否需要冻结列   | boolean | false |
| freezeCols       | 冻结的列      | array   | []    |
| isNeedResize     | 是否需要调整大小  | boolean | false |
| isResizeAdapt    | 是否调整时自适应  | boolean | true  |
| isNeedMerge      | 是否需要合并单元格 | boolean | false |
| mergeCols        | 合并的单元格列号  | array   | []    |
| columnSize       | 单元格宽度集合   | array   | []    |
| minColumnSize    | 最小列宽      | array   | []    |
| maxColumnSize    | 最大列宽      | array   | []    |
| headerRowSize    | 表头高度      | number  | 25    |
| rowSize          | 普通单元格高度   | number  | 25    |
| header           | 表头        | array   | []    |
| regionColumnSize | 列项间的      | array   | []    |
| items            | 子组件       | array   | []    |

## 方法
| 方法名                      | 说明          | 参数            |
| ------------------------ | ----------- | ------------- |
| setWidth                 | 设置宽度        | —             |
| setHeight                | 设置高度        | —             |
| setColumnSize            | 设置列宽        | columnSize    |
| getColumnSize            | 得到列宽        | —             |
| setRegionColumnSize      | 设置列项之间的间隙   | columnSize    |
| getRegionColumnSize      | 获得列项之间的间隙   | —             |
| setVerticalScroll        | 设置纵向滚动距离    | scrollTop     |
| setLeftHorizontalScroll  | 设置左到右横向滚动距离 | scrollLeft    |
| setRightHorizontalScroll | 设置右往左横向滚动距离 | scrollLeft    |
| getVerticalScroll        | 获取纵向滚动距离    | —             |
| getLeftHorizontalScroll  | 获取左到右横向滚动距离 | —             |
| getRightHorizontalScroll | 获取右往左横向滚动距离 | —             |
| attr                     | 设置属性        | key：键，value：值 |
| populate                 | 刷新内容        | rows          |
| restore                  | 保存表         | —             |

------

