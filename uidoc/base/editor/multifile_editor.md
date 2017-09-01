# bi.multifile_editor

## 多文件,基类[BI.Single](/core/single.md)

{% method %}
[source](https://jsfiddle.net/fineui/25r3r5fq/)

{% common %}
```javascript

BI.createWidget({
   type: "bi.multifile_editor",
   width: 400,
   height: 300
});


```

{% endmethod %}

## API
##### 基础属性
| 参数    | 说明           | 类型  | 可选值 | 默认值
| :------ |:-------------  | :-----| :----|:----
| multiple | 是否支持多选 | boolean | true,false| false |
| maxSize | 最大可选数量 | number | | -1 |
| accept | | string | | " "|
| url | 文件路径 | string | | " "|



## 对外方法
| 名称     | 说明                           |  回调参数     
| :------ |:-------------                  | :-----   
| select | 选择文件 | —|
| getValue | 获取文件名称 | —|
| upload | 文件上传| —|
| reset | 重置| —|

 


---


