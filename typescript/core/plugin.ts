import {_Widget} from "./widget";

type configWidgetFn = (options: object) =>  object
type configObjectFn = (widget: _Widget) => void

export  type _config = (widgetFunction: configWidgetFn | configWidgetFn[], objectFunction: configObjectFn | configObjectFn[]) => void

export  type _configWidget = (shorcut: string, widgetFunction: configWidgetFn) => void

export  type _registerObject = (shorcut: string, objectFunction: configObjectFn) => void

export type _Plugin = {
    config: _config;
    configWidget: _configWidget;
    registerObject: _registerObject;
}
