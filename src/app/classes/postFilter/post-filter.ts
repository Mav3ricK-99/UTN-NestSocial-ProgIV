
export class PostFilter {

    minDate: number;
    maxDate: number;
    orderBy: string;
    usersId: Array<string> | undefined;
    limit: number;

    constructor(minDate?: number, maxDate?: number, orderBy?: string, usersId?: Array<string>, limit?: number) {
        this.minDate = minDate ?? 0;
        this.maxDate = maxDate ?? (Math.floor(new Date().getTime() / 1000));
        this.orderBy = this.getOrderType(orderBy ?? 'Recientes');
        this.usersId = usersId;
        this.limit = 5;
    }

    getOrderType(orderBy: string) {
        let orderType = '';
        switch (orderBy) {
            case 'Recientes': { orderType = 'newest' }; break;
            case 'Populares': { orderType = 'most_liked' }; break;
            case 'Antiguos': { orderType = 'oldest' }; break;
        }

        return orderType;
    }
}

export const orders = ['Recientes', 'Antiguos', 'Populares'];