import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(link: string): Promise<unknown> {
    return browser.get(link) as Promise<unknown>;
  }

  getTitleText(selector: string): Promise<string> {
    return element(by.css('selector')).getText() as Promise<string>;
  }
}
