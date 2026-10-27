export default function extname(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index > 0 ? filename.slice(index) : "";
}
