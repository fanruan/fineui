# bi.select_list

### 选择列表

{% method %}
[source](https://jsfiddle.net/fineui/c3azpxss/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.editor_trigger",
  element: "body",
});

```

{% endmethod %}

### 参数

| 参数                | 说明      | 类型       | 默认值        |
| ----------------- | ------- | -------- | ---------- |
| validationChecker | 验证函数    | function | BI.emptyFn |
| quitChecker       | 退出时验证函数 | function | BI.emptyFn |
| allowBlank        | 是否允许为空  | bool     | false      |
| watermark         | 水印      | string   | ""         |
| errorText         | 错误信息    | string   | ""         |
| triggerWidth      | 触发器宽度   | number   | 30         |

### 方法

| 方法名      | 说明   | 参数    |
| -------- | ---- | ----- |
| setValue | 设置值  | value |
| getVlaue | 获得值  | —     |
