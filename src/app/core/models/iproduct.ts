export interface IProduct {
    _id: string,
    name: string,
    price: number,
    department: string,
    category: string[],
    brand: string,
    description: string,
    mainPic: string,
    images: string[],
    slug: string,
    stock: number
}

export interface IProductsListRes {
    message: string;
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    data: IProduct[];
}

export interface IProductRes {
    message: string;
    data: IProduct;
}