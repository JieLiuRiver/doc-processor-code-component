
// eslint-disable-next-line no-undef
export function readFileAsArrayBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (loadEvent: any) {
        const arrayBuffer = loadEvent.target.result;
        resolve(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      const base64String = reader.result as string;
      const base64 = base64String.split(",")[1];
      resolve(base64);
    };
  })
}


export function blobToBinary(blob: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const binaryString = Array.from(new Uint8Array(arrayBuffer as any), byte => String.fromCharCode(byte)).join('');
      resolve(binaryString);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export function upperFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getPlacholdersFromDoc(file: File) {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const resultRowText = await window.mammoth.extractRawText({ arrayBuffer } as any);

    const textEntries = [], imageEntries = [],textRegex = /{((?:(?!%).)+?)}/g, imageRegex = /{%(.*?)}/g;
    let textMatch, imageMatch;
    while ((textMatch = textRegex.exec(resultRowText.value)) !== null) {
      const expressionText = textMatch[1]
      if (expressionText) textEntries.push(expressionText.trim())
    }
    while ((imageMatch = imageRegex.exec(resultRowText.value)) !== null) {
      const expressionImage = imageMatch[1]
      if (expressionImage) imageEntries.push(expressionImage.trim())
    }
    return {
        textEntries,
        imageEntries
    }
}