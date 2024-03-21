export function getTestUrl(...pathes:string[]){
  //return ['https://www.eforms.cz'].concat(...pathes).join("/");
  return ['http://localhost:3000'].concat(...pathes).join("/");
}