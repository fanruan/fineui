/**
 * 事件集合
 * @class BI.Events
 */
_.extend(BI, {
    Events: {

        /**
         * @static
         * @property keydown事件
         */
        KEYDOWN: "_KEYDOWN",

        /**
         * @static
         * @property 回撤事件
         */
        BACKSPACE: "_BACKSPACE",

        /**
         * @static
         * @property 空格事件
         */
        SPACE: "_SPACE",

        /**
         * @static
         * @property 回车事件
         */
        ENTER: "_ENTER",

        /**
         * @static
         * @property 确定事件
         */
        CONFIRM: '_CONFIRM',

        /**
         * @static
         * @property 错误事件
         */
        ERROR: '_ERROR',

        /**
         * @static
         * @property 暂停事件
         */
        PAUSE: '_PAUSE',

        /**
         * @static
         * @property destroy事件
         */
        DESTROY: '_DESTROY',

        /**
         * @static
         * @property 清除选择
         */
        CLEAR: '_CLEAR',

        /**
         * @static
         * @property 添加数据
         */
        ADD: '_ADD',

        /**
         * @static
         * @property 正在编辑状态事件
         */
        EDITING: '_EDITING',

        /**
         * @static
         * @property 空状态事件
         */
        EMPTY: '_EMPTY',

        /**
         * @static
         * @property 显示隐藏事件
         */
        VIEW: '_VIEW',

        /**
         * @static
         * @property 窗体改变大小
         */
        RESIZE: "_RESIZE",

        /**
         * @static
         * @property 编辑前事件
         */
        BEFOREEDIT: '_BEFOREEDIT',

        /**
         * @static
         * @property 编辑后事件
         */
        AFTEREDIT: '_AFTEREDIT',

        /**
         * @static
         * @property 开始编辑事件
         */
        STARTEDIT: '_STARTEDIT',

        /**
         * @static
         * @property 停止编辑事件
         */
        STOPEDIT: '_STOPEDIT',

        /**
         * @static
         * @property 值改变事件
         */
        CHANGE: '_CHANGE',

        /**
         * @static
         * @property 下拉弹出菜单事件
         */
        EXPAND: '_EXPAND',

        /**
         * @static
         * @property 关闭下拉菜单事件
         */
        COLLAPSE: '_COLLAPSE',

        /**
         * @static
         * @property 回调事件
         */
        CALLBACK: '_CALLBACK',

        /**
         * @static
         * @property 点击事件
         */
        CLICK: '_CLICK',

        /**
         * @static
         * @property 状态改变事件，一般是用在复选按钮和单选按钮
         */
        STATECHANGE: '_STATECHANGE',

        /**
         * @static
         * @property 状态改变前事件
         */
        BEFORESTATECHANGE: '_BEFORESTATECHANGE',


        /**
         * @static
         * @property 初始化事件
         */
        INIT: '_INIT',

        /**
         * @static
         * @property 初始化后事件
         */
        AFTERINIT: '_AFTERINIT',

        /**
         * @static
         * @property 滚动条滚动事件
         */
        SCROLL: '_SCROLL',


        /**
         * @static
         * @property 开始加载事件
         */
        STARTLOAD: '_STARTLOAD',

        /**
         * @static
         * @property 加载后事件
         */
        AFTERLOAD: '_AFTERLOAD',


        /**
         * @static
         * @property 提交前事件
         */
        BS: 'beforesubmit',

        /**
         * @static
         * @property 提交后事件
         */
        AS: 'aftersubmit',

        /**
         * @static
         * @property 提交完成事件
         */
        SC: 'submitcomplete',

        /**
         * @static
         * @property 提交失败事件
         */
        SF: 'submitfailure',

        /**
         * @static
         * @property 提交成功事件
         */
        SS: 'submitsuccess',

        /**
         * @static
         * @property 校验提交前事件
         */
        BVW: 'beforeverifywrite',

        /**
         * @static
         * @property 校验提交后事件
         */
        AVW: 'afterverifywrite',

        /**
         * @static
         * @property 校验后事件
         */
        AV: 'afterverify',

        /**
         * @static
         * @property 填报前事件
         */
        BW: 'beforewrite',

        /**
         * @static
         * @property 填报后事件
         */
        AW: 'afterwrite',

        /**
         * @static
         * @property 填报成功事件
         */
        WS: 'writesuccess',

        /**
         * @static
         * @property 填报失败事件
         */
        WF: 'writefailure',

        /**
         * @static
         * @property 添加行前事件
         */
        BA: 'beforeappend',

        /**
         * @static
         * @property 添加行后事件
         */
        AA: 'afterappend',

        /**
         * @static
         * @property 删除行前事件
         */
        BD: 'beforedelete',

        /**
         * @static
         * @property 删除行后事件
         */
        AD: 'beforedelete',

        /**
         * @static
         * @property 未提交离开事件
         */
        UC: 'unloadcheck',


        /**
         * @static
         * @property PDF导出前事件
         */
        BTOPDF: 'beforetopdf',

        /**
         * @static
         * @property PDF导出后事件
         */
        ATOPDF: 'aftertopdf',

        /**
         * @static
         * @property Excel导出前事件
         */
        BTOEXCEL: 'beforetoexcel',

        /**
         * @static
         * @property Excel导出后事件
         */
        ATOEXCEL: 'aftertoexcel',

        /**
         * @static
         * @property Word导出前事件
         */
        BTOWORD: 'beforetoword',

        /**
         * @static
         * @property Word导出后事件
         */
        ATOWORD: 'aftertoword',

        /**
         * @static
         * @property 图片导出前事件
         */
        BTOIMAGE: 'beforetoimage',

        /**
         * @static
         * @property 图片导出后事件
         */
        ATOIMAGE: 'aftertoimage',

        /**
         * @static
         * @property HTML导出前事件
         */
        BTOHTML: 'beforetohtml',

        /**
         * @static
         * @property HTML导出后事件
         */
        ATOHTML: 'aftertohtml',

        /**
         * @static
         * @property Excel导入前事件
         */
        BIMEXCEL: 'beforeimportexcel',

        /**
         * @static
         * @property Excel导出后事件
         */
        AIMEXCEL: 'afterimportexcel',

        /**
         * @static
         * @property PDF打印前事件
         */
        BPDFPRINT: 'beforepdfprint',

        /**
         * @static
         * @property PDF打印后事件
         */
        APDFPRINT: 'afterpdfprint',

        /**
         * @static
         * @property Flash打印前事件
         */
        BFLASHPRINT: 'beforeflashprint',

        /**
         * @static
         * @property Flash打印后事件
         */
        AFLASHPRINT: 'afterflashprint',

        /**
         * @static
         * @property Applet打印前事件
         */
        BAPPLETPRINT: 'beforeappletprint',

        /**
         * @static
         * @property Applet打印后事件
         */
        AAPPLETPRINT: 'afterappletprint',

        /**
         * @static
         * @property 服务器打印前事件
         */
        BSEVERPRINT: 'beforeserverprint',

        /**
         * @static
         * @property 服务器打印后事件
         */
        ASERVERPRINT: 'afterserverprint',

        /**
         * @static
         * @property 邮件发送前事件
         */
        BEMAIL: 'beforeemail',

        /**
         * @static
         * @property 邮件发送后事件
         */
        AEMAIL: 'afteremail'
    }
});