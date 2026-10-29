import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { IProduct, IProductRes, IProductsListRes } from '../models/iproduct';

export interface IProductSearchParams {
  q?: string;
  category?: string;
  department?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ISearchResponse {
  message: string;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: IProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _http = inject(HttpClient);
  private _apiURL = environment.apiURL + 'products/';

  getAllProducts(params?: IProductSearchParams) {
    let httpParams = new HttpParams();
    if (params) {
      if (params.q) httpParams = httpParams.set('q', params.q);
      if (params.category && params.category !== 'all') httpParams = httpParams.set('category', params.category);
      if (params.department && params.department !== 'all') httpParams = httpParams.set('department', params.department);
      if (params.minPrice !== undefined && params.minPrice !== null) httpParams = httpParams.set('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined && params.maxPrice !== null) httpParams = httpParams.set('maxPrice', String(params.maxPrice));
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this._http.get<IProductsListRes>(this._apiURL, { params: httpParams });
  }

  searchProducts(params: IProductSearchParams) {
    let httpParams = new HttpParams();
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.category && params.category !== 'all') httpParams = httpParams.set('category', params.category);
    if (params.department && params.department !== 'all') httpParams = httpParams.set('department', params.department);
    if (params.minPrice !== undefined && params.minPrice !== null) httpParams = httpParams.set('minPrice', String(params.minPrice));
    if (params.maxPrice !== undefined && params.maxPrice !== null) httpParams = httpParams.set('maxPrice', String(params.maxPrice));
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.page) httpParams = httpParams.set('page', String(params.page));
    if (params.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this._http.get<ISearchResponse>(this._apiURL + 'search', { params: httpParams });
  }

  getPaginatedProducts(page: number = 1, limit: number = 8) {
    let httpParams = new HttpParams().set('page', String(page)).set('limit', String(limit));
    return this._http.get<IProductsListRes>(this._apiURL + 'pages', { params: httpParams });
  }

  getProductsByCategory(category: string) {
    return this._http.get<IProductsListRes>(this._apiURL + 'category/' + category);
  }

  getProductsByDepartment(department: string) {
    return this._http.get<IProductsListRes>(this._apiURL + 'department/' + department);
  }

  getProductBySlug(slug: string) {
    return this._http.get<IProductRes>(this._apiURL + slug);
  }

  addProduct(formData: FormData) {
    return this._http.post<{ message: string; data: IProduct }>(this._apiURL, formData);
  }

  updateProduct(id: string, formData: FormData) {
    return this._http.put<{ message: string; data: IProduct }>(this._apiURL + id, formData);
  }

  deleteProduct(id: string) {
    return this._http.delete<{ message: string; data: IProduct }>(this._apiURL + id);
  }
}
