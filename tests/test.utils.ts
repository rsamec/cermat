export function getTestUrl(...pathes:string[]){
  //return ['https://www.eforms.cz'].concat(...pathes).join("/");
  return ['http://localhost:3000'].concat(...pathes).join("/");
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}