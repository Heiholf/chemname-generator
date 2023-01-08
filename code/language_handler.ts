import Languages, { LanguageSettings } from './languages'


class LanguageHandler {
  private static _instance: LanguageHandler
  private _language: LanguageSettings

  constructor() {
    this._language = Languages.English
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  public get language() {
    return this._language
  }

  public setLanguage(language: LanguageSettings) {
    this._language = language
    return this.language
  }
}

export default LanguageHandler
