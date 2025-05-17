export enum generalStateTypes {
	ACTIVO = "ACTIVO",
	INACTIVO = "INACTIVO",
	ELIMINADO = "ELIMINADO",
}


export interface AppHttpResponse<T> {
    body: T;
    hasErrors: boolean;
    errors: Error[];
    friendlyMessage: string;
  }
  
  interface Error {
    error: string;
    errorCode: string;
    errorDescription: string;
  }
  

export class TrackHttpError implements AppHttpResponse<any>{
    body: any;
    hasErrors: boolean;
    errors: Error[];
    friendlyMessage: string;
  }
  

  export class Profile {
    name!: string;
    state!: generalStateTypes;
    enumName!: ProfilesEnum;
  }

  
  export enum ProfilesEnum {
    PRGRAMADOR = "PROGRAMADOR",
    ROOT = "ROOT",
}

export interface Record {
  [x: string]: any;
  id: string;
  text: string;
  checked?: boolean;
  disabled?: boolean;
  value?: any;
}
