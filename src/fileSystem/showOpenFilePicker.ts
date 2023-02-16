import type from '../../node_modules/@types/wicg-file-system-access';

export async function showOpenFilePicker() {
  const [fileHandle] = await window.showOpenFilePicker();
  return fileHandle;
}

export async function readContentsFrom(fileHandle: FileSystemFileHandle) {
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return contents;
}
