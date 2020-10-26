import { _Widget } from "./widget";

type configWidgetFn = (type: string, options: Obj) => void
type configObjectFn = (type: string, widget: _Widget) => void

export type _config = (widgetFunction: configWidgetFn | configWidgetFn[], objectFunction: configObjectFn | configObjectFn[]) => void

export type _configWidget = (shortcut: string, widgetFunction: configWidgetFn) => void

export type _registerObject = (shortcut: string, objectFunction: configObjectFn) => void

export type _Plugin = {
    config: _config;
    configWidget: _configWidget;
    registerObject: _registerObject;
}
