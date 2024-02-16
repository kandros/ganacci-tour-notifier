export async function read(path: string): Promise<TourDate | null> {
  const file = Bun.file(path);
  if (!file.exists()) {
    return null;
  }

  return file.json();
}

export async function write(path: string, content: TourDate[]) {
  return Bun.write(path, JSON.stringify(content, null, 2));
}
