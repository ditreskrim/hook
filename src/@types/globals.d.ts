export {};
declare global {
  interface Window {
    // add you custom properties and methods
    whois?: Function;
    whois_data?: object;
  }

  // @ts-ignore
  interface HTMLDocument {
    // add you custom properties and methods
    currentScript: HTMLScriptElement;
  }

  interface HTMLFormElement {
    formSerializeObject(): object;
  }

  interface FormData {
    serializeObjectForm(): object;
  }

  interface Object {
    JsonStringify(): string;
  }

  interface SubmitEvent {
    target: HTMLFormElement;
  }
}
