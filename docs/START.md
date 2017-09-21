

#### 第一个demo
```html
<html>
    <head>
          <meta charset="utf-8">
          <title></title>
          <link rel="stylesheet" type="text/css" href="https://fanruan.coding.me/fineui/dist/bundle.min.css" />
          <script src="https://coding.net/u/fanruan/p/fineui/git/raw/master/dist/bundle.min.js"></script>
    </head>
    <body>
          <script>
            $(function(){
                BI.createWidget({
                    type:"bi.absolute",
                    element: "body",
                    items: [{
                        el:{
                            type: "bi.button",
                            text: "这是一个按钮"
                        },
                        left: 100,
                        top: 100
                    }]
                })
            })
          </script>
    </body>
</html>
```
#### 源码集成配置
[http://www.finedevelop.com/pages/viewpage.action?pageId=16056735](http://www.finedevelop.com/pages/viewpage.action?pageId=16056735)

#### 源码集成Demo
BI的组件就是集成的fineui进行开发的
[https://coding.net/u/fanruan/p/bi-components/](https://coding.net/u/fanruan/p/bi-components/)
