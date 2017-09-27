# bi.table

### htape与vertical混合形成的布局，用于二维表结构的布局
{% method %}
[source](https://jsfiddle.net/fineui/8t2en619/)

{% common %}
```javascript
BI.createWidget({
  element: "body",
  type: "bi.table",
  items: [],
  columnSize: [100, "fill", 200],
  rowSize: [10, 30, 50, 70, 90, 110, 130],
  hgap: 20,
  vgap: 10
});
```

{% endmethod %}

## 参数设置
| 参数         | 说明        | 类型           | 默认值                                      |
| ---------- | --------- | ------------ | ---------------------------------------- |
| scrolly    | 是否出现滚动条   | boolean         | true                                     |
| columnSize | 列项宽度      | array/number | [200, 200, 'fill']                       |
| rowSize    | 行高        | array/number | 30                                       |
| hgap       | 内部元素间纵向距离 | number       | 0                                        |
| vgap       | 内部元素间横向距离 | number       | 0                                        |
| items      | 子项        | array        | [{width: 100,el: {type: 'bi.button', text: 'button1'}},{width: 'fill',el: {type: 'bi.button', text: 'button2'}},{width: 200,el: {type: 'bi.button', text: 'button3'}}] |

## 方法
| 方法名      | 说明     | 用法               |
| :------- | ------ | ---------------- |
| addItem  | 增加内容   | addItem(arr)     |
| populate | 刷新 | populate(items) |

