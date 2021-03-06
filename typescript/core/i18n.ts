export type _addI18n = (v: string | object) => string;

export type _i18nText = (key: string, ..._args: any[]) => string;

export type _i18n = {
    addI18n: _addI18n;
    i18nText: _i18nText;
}