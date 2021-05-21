export interface StudentData {
    name: string;
    surname: string;
    age: number;
    file?: string;
    id?: number;
    createdBy?: string;
}
export interface StudentResponse {
    status: boolean;
    data: string;
}

export interface StudentDelete {
    file: string;
    code: number;
}

export interface StudentReadResponse {
    status: boolean;
    data: any[];
}

export interface StudentEnrollement {
    data: any[];
}
