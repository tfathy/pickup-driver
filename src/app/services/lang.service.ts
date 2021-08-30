import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class LangService {
  public appDirection = 'rtl';
  public lang = 'ar';
  constructor(private translate: TranslateService) {}
  change2Arabic() {
    this.setLanguage('ar');
    this.appDirection = 'rtl';
    this.lang = 'ar';
  }
  change2English() {
    this.setLanguage('en');
    this.appDirection = 'ltr';
    this.lang = 'en';
  }
  async getDefaultLanguage() {
    this.setLanguage('ar');
    return { appDirection: 'rtl', lang: 'ar' };
  }
  private setLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }
}
