# bi.direction_pager

### 显示页码的分页控件

{% method %}
[source](https://jsfiddle.net/fineui/vyc36s2a/)

{% common %}
```javascript

var pager = BI.createWidget({
  type: 'bi.direction_pager',
  height: 30,
  horizontal: {
  	pages: 10, //必选项
  	curr: 1, //初始化当前页， pages为数字时可用，
  	firstPage: 1,
    lastPage: 10,
  },
  vertical: {
  	pages: 10, //必选项
  	curr: 1, //初始化当前页， pages为数字时可用，
  	firstPage: 1,
    lastPage: 10,
  },
  element: 'body',
});

```

{% endmethod %}

### 参数

| 参数         | 二级参数      | 说明                     | 类型              | 默认值        |
| ---------- | --------- | ---------------------- | --------------- | ---------- |
| height     |           | 控件高度                   | number          | 30         |
| horizontal |           | 横向翻页设置                 | object          | —          |
|            | pages     | 总页数                    | number/boolean     | false      |
|            | curr      | 当前页， pages为数字时可用       | number          | 1          |
|            | hasPrev   | 判断是否有前一页的方法            | function        | BI.emptyFn |
|            | hasNext   | 判断是否有后一页的方法            | function        | BI.emptyFn |
|            | firstPage | 第一页                    | number          | 1          |
|            | lastPage  | 最后一页                   | number/function | BI.emptyFn |
| vertical   |           | 纵向翻页设置，参数与horizontal相同 | object          | —          |



### 方法

| 方法名              | 说明         | 参数   |
| ---------------- | ---------- | ---- |
| getVPage         | 获取纵向页码     | —    |
| getHPage         | 获取水平向页码    | —    |
| setVPage         | 获取纵向页码     | v    |
| setHPage         | 获取水平向页码    | v    |
| hasVNext         | 纵向坐标是否有下一页 | —    |
| hasHNext         | 横向坐标是否有下一页 | —    |
| hasVPrev         | 纵向坐标是否有上一页 | —    |
| hasHPrev         | 横向坐标是否有上一页 | —    |
| setHPagerVisible | 设置横向分页键可见  | —    |
| setVPagerVisible | 设置纵向分页键可见  | —    |
| populate         | 清空内容       | —    |

------