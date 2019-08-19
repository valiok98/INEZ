
export interface initialState {
    comments: string[];
}

export interface reducers {
    comments: (state: any, action: object) => {}
}