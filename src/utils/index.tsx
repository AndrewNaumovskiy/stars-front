import ky from "ky";

export function GetIP(): string {
    return "https://localhost:44349/";
    return "http://18.193.72.105/";
}

export const api = ky.create({
    prefixUrl: GetIP(),
    retry: 5,
    timeout: 30 * 1000
});

export function uuidv4() {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

export interface IError {
    description: string;
}