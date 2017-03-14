;
!(function (BI) {

    if (BI.isIE()) {
        XMLSerializer = null;
        DOMParser = null;
    }


    var XML = {
        Document: {
            NodeType: {
                ELEMENT: 1,
                ATTRIBUTE: 2,
                TEXT: 3,
                CDATA_SECTION: 4,
                ENTITY_REFERENCE: 5,
                ENTITY: 6,
                PROCESSING_INSTRUCTION: 7,
                COMMENT: 8,
                DOCUMENT: 9,
                DOCUMENT_TYPE: 10,
                DOCUMENT_FRAGMENT: 11,
                NOTATION: 12
            }
        }
    };

    XML.ResultType = {
        single: 'single',
        array: 'array'
    };

    XML.fromString = function (xmlStr) {
        try {
            var parser = new DOMParser();
            return parser.parseFromString(xmlStr, "text/xml");
        } catch (e) {
            var arrMSXML = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
            for (var i = 0; i < arrMSXML.length; i++) {
                try {
                    var xmlDoc = new ActiveXObject(arrMSXML[i]);
                    xmlDoc.setProperty("SelectionLanguage", "XPath");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlStr);
                    return xmlDoc;
                } catch (xmlError) {
                }
            }
        }
    };

    XML.toString = function (xmlNode) {
        if (!BI.isIE()) {
            var xmlSerializer = new XMLSerializer();
            return xmlSerializer.serializeToString(xmlNode);
        } else
            return xmlNode.xml;
    };

    XML.getNSResolver = function (str) {
        if (!str)
            return null;
        var list = str.split(' ');
        var namespaces = {};
        for (var i = 0; i < list.length; i++) {
            var pair = list[i].split('=');
            var fix = BI.trim(pair[0]).replace("xmlns:", "");
            namespaces[fix] = BI.trim(pair[1]).replace(/"/g, "").replace(/'/g, "");
        }
        return function (prefix) {
            return namespaces[prefix];
        };
    };

    XML.eval = function (context, xpathExp, resultType, namespaces) {
        if ((BI.isIE() && ('undefined' === typeof(context.selectSingleNode) || 'undefined' === typeof(context.selectNodes)))) {
            return XML.eval2(context, xpathExp, resultType, namespaces);
        } else {
            if (BI.isIE()) {
                namespaces = namespaces ? namespaces : "";
                var doc = (context.nodeType == XML.Document.NodeType.DOCUMENT) ? context : context.ownerDocument;
                doc.setProperty("SelectionNamespaces", namespaces);
                var result;
                if (resultType == this.ResultType.single) {
                    result = context.selectSingleNode(xpathExp);
                } else {
                    result = context.selectNodes(xpathExp) || [];
                }
                doc.setProperty("SelectionNamespaces", "");
                return result;
            } else {
                var node = context;
                var xmlDoc = (context.nodeName.indexOf("document") == -1) ? context.ownerDocument : context;
                var retType = (resultType == this.ResultType.single) ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ANY_TYPE;
                var col = xmlDoc.evaluate(xpathExp, node, XML.getNSResolver(namespaces), retType, null);

                if (retType == XPathResult.FIRST_ORDERED_NODE_TYPE) {
                    return col.singleNodeValue;
                } else {
                    var thisColMemb = col.iterateNext();
                    var rowsCol = [];
                    while (thisColMemb) {
                        rowsCol[rowsCol.length] = thisColMemb;
                        thisColMemb = col.iterateNext();
                    }
                    return rowsCol;
                }
            }
        }
    };

    XML.eval2 = function (context, xpathExp, resultType, namespaces) {
        if (resultType !== "single" && resultType !== undefined && resultType !== null) {
            throw new Error("justep.SimpleXML.eval只支持resultType='single', 不支持" + resultType);
        }

        if (context === null || context === undefined || xpathExp === null || xpathExp === undefined) {
            return context;
        }

        if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
            context = context.documentElement;
        }

        var childs, i;
        if (xpathExp.indexOf("/") != -1) {
            var items = xpathExp.split("/");
            var isAbs = xpathExp.substring(0, 1) == "/";
            for (i = 0; i < items.length; i++) {
                var item = items[i];
                if (item === "") {
                    continue;
                } else {
                    var next = null;
                    var ii = i + 1;
                    for (; ii < items.length; ii++) {
                        if (next === null) {
                            next = items[ii];
                        } else {
                            next = next + "/" + items[ii];
                        }
                    }

                    if (item == ".") {
                        return this.eval(context, next, resultType);

                    } else if (item == "..") {
                        return this.eval2(context.parentNode, next, resultType);

                    } else if (item == "*") {
                        if (isAbs) {
                            return this.eval2(context, next, resultType);

                        } else {
                            childs = context.childNodes;
                            for (var j = 0; j < childs.length; j++) {
                                var tmp = this.eval2(childs[j], next, resultType);
                                if (tmp !== null) {
                                    return tmp;
                                }
                            }
                            return null;
                        }

                    } else {
                        if (isAbs) {
                            if (context.nodeName == item) {
                                return this.eval2(context, next, resultType);
                            } else {
                                return null;
                            }
                        } else {
                            var child = this.getChildByName(context, item);
                            if (child !== null) {
                                return this.eval2(child, next, resultType);
                            } else {
                                return null;
                            }

                        }
                    }

                }
            }

            return null;

        } else {
            if ("text()" == xpathExp) {
                childs = context.childNodes;
                for (i = 0; i < childs.length; i++) {
                    if (childs[i].nodeType == XML.Document.NodeType.TEXT) {
                        return childs[i];
                    }
                }
                return null;
            } else {
                return this.getChildByName(context, xpathExp);
            }
        }
    };

    XML.getChildByName = function (context, name) {
        if (context === null || context === undefined || name === null || name === undefined) {
            return null;
        }

        if (context.nodeType == XML.Document.NodeType.DOCUMENT) {
            context = context.documentElement;
        }

        var childs = context.childNodes;
        for (var i = 0; i < childs.length; i++) {
            if (childs[i].nodeType == XML.Document.NodeType.ELEMENT && (childs[i].nodeName == name || name == "*")) {
                return childs[i];
            }
        }

        return null;
    };

    XML.appendChildren = function (context, xpathExp, nodes, isBefore) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            if (isBefore && finded[i].firstNode) {
                this._insertBefore(finded[i], nodes, finded[i].firstNode);
            } else {
                for (var j = 0; j < nodes.length; j++) {
                    finded[i].appendChild(nodes[j]);
                }
            }
        }
        return count;
    };

    XML.removeNodes = function (context, xpathExp) {
        var nodes = this.eval(context, xpathExp);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    };

    XML._insertBefore = function (parent, newchildren, refchild) {
        for (var i = 0; i < newchildren.length; i++) {
            parent.insertBefore(newchildren[i], refchild);
        }
    };

    XML.insertNodes = function (context, xpathExp, nodes, isBefore) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            var refnode = (isBefore) ? finded[i] : finded[i].nextSibling;
            this._insertBefore(finded[i].parentNode, nodes, refnode);
        }
        return count;
    };

    XML.replaceNodes = function (context, xpathExp, nodes) {
        nodes = (typeof nodes.length != "undefined") ? nodes : [nodes];
        var finded = this.eval(context, xpathExp);
        var count = finded.length;
        for (var i = 0; i < count; i++) {
            var refnode = finded[i];
            var parent = refnode.parentNode;
            this._insertBefore(parent, nodes, refnode);
            parent.removeChild(refnode);
        }
        return count;
    };

    XML.setNodeText = function (context, xpathExp, text) {
        var finded = this.eval(context, xpathExp, this.ResultType.single);
        if (finded === null)
            return;
        if (finded.nodeType == XML.Document.NodeType.ELEMENT) {
            var textNode = this.eval(finded, "./text()", this.ResultType.single);
            if (!textNode) {
                textNode = finded.ownerDocument.createTextNode("");
                finded.appendChild(textNode);
            }
            textNode.nodeValue = text;
        } else {
            finded.nodeValue = text;
        }
        return;
    };

    XML.getNodeText = function (context, xpathExp, defaultValue) {
        var finded = xpathExp ? this.eval(context, xpathExp, this.ResultType.single) : context;
        if (finded && (finded.nodeType == XML.Document.NodeType.ELEMENT)) {
            finded = this.eval(finded, "./text()", this.ResultType.single);
        }
        return (finded && finded.nodeValue) ? "" + finded.nodeValue : (defaultValue !== undefined) ? defaultValue : null;
    };

    XML.Namespaces = {
        XMLSCHEMA: "http://www.w3.org/2001/XMLSchema#",
        XMLSCHEMA_STRING: "http://www.w3.org/2001/XMLSchema#String",
        XMLSCHEMA_LONG: "http://www.w3.org/2001/XMLSchema#Long",
        XMLSCHEMA_INTEGER: 'http://www.w3.org/2001/XMLSchema#Integer',
        XMLSCHEMA_FLOAT: 'http://www.w3.org/2001/XMLSchema#Float',
        XMLSCHEMA_DOUBLE: 'http://www.w3.org/2001/XMLSchema#Double',
        XMLSCHEMA_DECIMAL: 'http://www.w3.org/2001/XMLSchema#Decimal',
        XMLSCHEMA_DATE: 'http://www.w3.org/2001/XMLSchema#Date',
        XMLSCHEMA_TIME: 'http://www.w3.org/2001/XMLSchema#Time',
        XMLSCHEMA_DATETIME: 'http://www.w3.org/2001/XMLSchema#DateTime',
        XMLSCHEMA_BOOLEAN: 'http://www.w3.org/2001/XMLSchema#Boolean',
        XMLSCHEMA_SYMBOL: 'http://www.w3.org/2001/XMLSchema#Symbol',
        JUSTEPSCHEMA: "http://www.justep.com/xbiz#",
        RDF: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        JUSTEP: "http://www.justep.com/x5#",
        'get': function (type) {
            type = type ? type.toLowerCase() : "string";
            if ("string" == type)
                return XML.Namespaces.XMLSCHEMA_STRING;
            else if ("integer" == type)
                return XML.Namespaces.XMLSCHEMA_INTEGER;
            else if ("long" == type)
                return XML.Namespaces.XMLSCHEMA_LONG;
            else if ("float" == type)
                return XML.Namespaces.XMLSCHEMA_FLOAT;
            else if ("double" == type)
                return XML.Namespaces.XMLSCHEMA_DOUBLE;
            else if ("decimal" == type)
                return XML.Namespaces.XMLSCHEMA_DECIMAL;
            else if ("date" == type)
                return XML.Namespaces.XMLSCHEMA_DATE;
            else if ("time" == type)
                return XML.Namespaces.XMLSCHEMA_TIME;
            else if ("datetime" == type)
                return XML.Namespaces.XMLSCHEMA_DATETIME;
            else if ("boolean" == type)
                return XML.Namespaces.XMLSCHEMA_BOOLEAN;
        }
    };
})(BI);