export interface BrowserlessAttribute {
  name: string;
  value: string;
}

export interface BrowserlessElementResult {
  attributes: BrowserlessAttribute[];
  height?: number;
  html?: string;
  left?: number;
  text?: string;
  top?: number;
  width?: number;
  src?: string;
}

export interface BrowserlessSelectorResult {
  selector: string;
  results: BrowserlessElementResult[];
}

export interface BrowserlessScrapeResponse {
  data: BrowserlessSelectorResult[];
}
