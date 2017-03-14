/**
 * guy
 * @class BI.ScrollView
 * @extends BI.Widget
 */
BI.ScrollView = BI.inherit(BI.Widget, {

    _const: {
        dropDownHeight: 15,
        expandIcon: "column-next-page-h-font",
        collapseIcon: "column-pre-page-h-font"
    },

    _defaultConfig: function() {
        return BI.extend(BI.ScrollView.superclass._defaultConfig.apply(this, arguments), {
            baseCls:"bi-scroll-view",
            scrollHeight: 50,
            maxHeight: 300
        })
    },

    _init : function() {
        BI.ScrollView.superclass._init.apply(this, arguments);

        this.scrollUp = false;
        this.scroll = BI.createWidget({
            type: "bi.vertical",
            cls: "scroll-container",
            scrolly: true
        })
        BI.createWidget({
            type: "bi.vertical",
            element: this.element,
            scrolly: false,
            items: [this.scroll]
        })

        this.dropdown = BI.createWidget({
            type: "bi.icon_button",
            height: this._const.dropDownHeight,
            cls: "scroll-drop-down-icon " + this._const.expandIcon,
            handler: BI.bind(this._dropDownOrUp, this)
        })

        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.dropdown,
                left: 0,
                right: 0,
                bottom: -1 * this._const.dropDownHeight
            }]
        })
        this.populate(this.options.items);
    },

    _dropDownOrUp: function(){
        if(!this.scrollUp){
            var height = this.element.height();
            height += this.options.scrollHeight;
            height = Math.min(height, this.scroll.element[0].scrollHeight, this.options.maxHeight);
            this.element.height(height);
            this._checkDropDownState();
        } else {
            var height = this.element.height();
            height -= this.options.scrollHeight;
            height = Math.max(height, this.options.height);
            this.element.height(height);
            this._checkDropDownState();
        }
    },

    _checkDropDownState: function(){
        var height = this.element.height();
        if(!this._checkScroll() || height >= this.options.maxHeight){
            this.scrollUp = true;
            this.dropdown.element.removeClass(this._const.expandIcon).addClass(this._const.collapseIcon);
        } else if(height <= this.options.height){
            this.scrollUp = false;
            this.dropdown.element.addClass(this._const.expandIcon);
        } else {
            this.dropdown.element.addClass(this.scrollUp ? this._const.collapseIcon : this._const.expandIcon);
        }
    },

    _checkScroll: function(){
        this.scroll.element.height(this.element.height());
        return this.scroll.element[0].scrollHeight > this.scroll.element[0].clientHeight;
    },

    _checkDropDown: function(){
        if(this._checkScroll()){
            this.dropdown.visible();
            //this.scrollUp = false;
            this._checkDropDownState();
        } else {
            this.dropdown.invisible();
        }
    },

    populate: function(){
        this.scroll.populate.apply(this.scroll, arguments);
        this.resize();
    },

    resize: function(){
        this.element.height(this.options.height);
        BI.nextTick(BI.bind(this._checkDropDown, this));
    },

    addItem: function(){
        this.scroll.addItem.apply(this.scroll, arguments);
        BI.nextTick(BI.bind(this._checkDropDown, this));
    }
});

$.shortcut("bi.scroll_view", BI.ScrollView);