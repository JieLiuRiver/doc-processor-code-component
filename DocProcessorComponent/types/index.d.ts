
interface Window {
  mammoth: any;
}

declare module 'mammoth/mammoth.browser' {
    export function convertToHtml(
      file: File,
      options?: any,
    ): Promise<any>;
    export function convertToMarkdown(
      file: File,
      options?: any,
    ): Promise<any>;
    export function extractRawText(
      file: File,
      options?: any,
    ): Promise<any>;
}

declare module 'docxtemplater-image-module-free';
declare module 'rc-color-picker/lib/Panel';
