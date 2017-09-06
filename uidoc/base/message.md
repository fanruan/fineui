# bi.Msg

#### 消息提示

{% method %}
[source](https://jsfiddle.net/fineui/feu8kf4u/)

{% common %}
```javascript

BI.createWidget({
  type: "bi.button",
  element: "#wrapper",
  text : '点击我弹出一个消息框',
  height : 30,
  handler : function() {
      BI.Msg.confirm('测试消息框',"我是测试消息框的内容");
  }
});
	


```

{% endmethod %}




## 对外方法
| 名称     | 说明          |  回调参数     
| :------ |:------------- | :-----   
| alert   |  警告消息框   | title, message, callback|
| confirm | 确认消息框    | title, message, callback   |
| prompt  | 提示消息框    | title, message, value, callback, min_width |
| toast   |  toast提示   | message, level, context|


---
