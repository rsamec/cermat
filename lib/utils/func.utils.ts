
export type StaticFunctionsMap<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

export type FunctionNames<T> = Extract<keyof T, string>;


export function getStaticFunctionsMap<T>(classObject: T): StaticFunctionsMap<T> {
  const functionMap: Partial<StaticFunctionsMap<T>> = {};

  const propertyNames = Object.getOwnPropertyNames(classObject) as (keyof T)[];

  for (const propertyName of propertyNames) {
    const property = classObject[propertyName];

    if (typeof property === 'function' && (property as any).prototype) {
      functionMap[propertyName] = property as StaticFunctionsMap<T>[keyof T];;
    }
  }

  return functionMap as StaticFunctionsMap<T>;
}
function executeFunctionByName<T>(
  classObject: T,
  functionName: FunctionNames<T>,
  args: Parameters<T[FunctionNames<T>]>
): ReturnType<T[FunctionNames<T>]> | undefined {
  const functionMap = getStaticFunctionsMap(classObject);

  const selectedFunction = functionMap[functionName];

  if (selectedFunction) {
    return selectedFunction(...args);
  }

  console.error(`Function ${functionName} not found.`);
  return undefined;
}

type GenericFunction = (...args:any) => any;

export type FunctionsMap<T,F extends (...args: Parameters<F>) => ReturnType<F>> = {
  [K in keyof T]: T[K] extends F ? T[K] : never;
};

export class FunctionCatalog<T, F extends (...args: Parameters<F>) => ReturnType<F>>{
  constructor(private catalog: FunctionsMap<T,F>){

  }
  
  callFunction(name: FunctionNames<T>, ...args: Parameters<F>) {
    //return (...args: Parameters<F>) => {
      //console.log(args);
      return this.catalog[name](...args)
    //}
  } 

}

