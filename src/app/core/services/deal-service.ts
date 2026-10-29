import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/env';
import { IDeal, IDealRes, IDealsRes } from '../models/ideal';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private _http = inject(HttpClient);
  private _apiURL = environment.apiURL + 'deals/';

  getActiveDeals() {
    return this._http.get<IDealsRes>(this._apiURL);
  }

  getAllDeals() {
    return this._http.get<IDealsRes>(this._apiURL + 'all');
  }

  getDealById(id: string) {
    return this._http.get<IDealRes>(this._apiURL + id);
  }

  createDeal(payload: any) {
    return this._http.post<IDealRes>(this._apiURL, payload);
  }

  updateDeal(id: string, payload: any) {
    return this._http.put<IDealRes>(this._apiURL + id, payload);
  }

  deleteDeal(id: string) {
    return this._http.delete<{ message: string; data: IDeal }>(this._apiURL + id);
  }
}
