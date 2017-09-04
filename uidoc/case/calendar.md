# bi.calendar

### 日历控件

{% method %}
[source](https://jsfiddle.net/fineui/4sfsaoma/)

{% common %}
```javascript

BI.createWidget({
  type: 'bi.calendar',
  min: '1900-01-01', //最小日期
  max: '2099-12-31', //最大日期
  year: 2015,
  month: 7,  //7表示八月
  day: 25,
});

```

{% endmethod %}



### 参数

| 参数    | 说明    | 类型     | 默认值          |
| ----- | ----- | ------ | ------------ |
| min   | 最小日期  | string | '1900-01-01' |
| max   | 最大日期  | string | '2099-12-31' |
| year  | 设定的年份 | number | 2015         |
| month | 设定的月份 | number | 7            |
| day   | 设定的日期 | number | 25           |



### 方法

| 方法名         | 说明      | 参数                         |
| ----------- | ------- | -------------------------- |
| isFrontDate | 是否为最小日期 | —                          |
| isFinalDate | 是否为最大日期 | —                          |
| setValue    | 设置日期    | object: {year, month, day} |
| getVlaue    | 获得日期    | —                          |

