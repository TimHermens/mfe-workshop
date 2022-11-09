export interface Schema {
  name: string;
  app?: string;
  domain: string;
  page?: string;
  styleext?: string;
  selector?: string;
  directory?: string;
}
export interface Options {
  name: string;
  pageProjectName: string;
  applicationName: string;
  pagePathAlias: string;
  selector: string;
  domain: string;
  pageProjectRoot?: string;
  parentPageName?: string;
  hasParentPage: boolean;
  page?: string;
}
