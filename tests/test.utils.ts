export function getTestUrl(...pathes:string[]){
  return ['https://rsamec.github.io/cermat'].concat(...pathes).join("/");
  //return ['http://localhost:3000'].concat(...pathes).join("/");
}