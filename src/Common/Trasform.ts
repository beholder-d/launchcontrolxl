type ModifyType<T, K extends keyof T, U> = {
    [P in keyof T]: P extends K ? U : T[P];
};

type SetString<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? string : T[P];
};

export type {
    ModifyType,
    SetString
};