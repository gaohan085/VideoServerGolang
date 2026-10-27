export default function SN(str: string): string {
  const regex = /([0-9]|[a-z]|[A-Z]){2,}-[0-9]{3,}/g;

  return str.match(regex) === null ? "" :str.match(regex)![0] ;
}
