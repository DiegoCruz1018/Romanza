import { Observable } from "rxjs";
import { PaginationDTO } from "../models/PaginationDTO";
import { HttpResponse } from "@angular/common/http";

export interface IServiceCRUD<TDTO, TCreationDTO> {
    get(pagination: PaginationDTO): Observable<HttpResponse<TDTO[]>>;
    getById(id: number | string): Observable<TDTO>;
    create(entity: TCreationDTO): Observable<any>;
    update(id: number | string, entity: TCreationDTO): Observable<any>;
    delete(id: number): Observable<any>;
}