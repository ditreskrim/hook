export {};
declare global {
  interface Window {
    // add you custom properties and methods
    _LOL?: Hook;
  }
  // @ts-ignore
  interface HTMLDocument {
    // add you custom properties and methods
    currentScript: HTMLScriptElement;
  }

  interface HTMLFormElement {
    serializeObject(): object;
  }
  interface FormData {
    serializeObject(): object;
  }

  interface Object {
    serializeJSON(): string;
  }

  interface SubmitEvent {
    target: HTMLFormElement;
  }
}
