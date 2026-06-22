export class PostFilter {

    minDate: number | undefined;
    maxDate: number | undefined;
    orderBy: string | undefined;
    usersId: Array<string> | undefined;
    limit: number;

    constructor(minDate?: number, maxDate?: number, orderBy?: string, usersId?: Array<string>, limit?: number) {
        this.minDate = minDate;
        this.maxDate = maxDate;
        this.orderBy = orderBy;
        this.usersId = usersId;
        this.limit = 5;
    }
}

export const orders = ['Todos', 'Seguidos', 'Populares'];