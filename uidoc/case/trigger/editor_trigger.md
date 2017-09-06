# bi.editor_trigger

### 文本输入框trigger

{% method %}
[source](https://jsfiddle.net/fineui/8ttm4g1u/)

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
| allowBlank        | 是否允许为空  | boolean  | false      |
| watermark         | 水印      | string   | ""         |
| errorText         | 错误信息    | string   | ""         |
| triggerWidth      | 触发器宽度   | number   | 30         |



### 方法

| 方法名      | 说明   | 参数    |
| -------- | ---- | ----- |
| setValue | 设置值  | value |
| getVlaue | 获得值  | —     |
| setText  |      | text  |

------

