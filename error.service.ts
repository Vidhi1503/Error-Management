
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export const API_URL = 'http://192.168.1.135:5000';

export interface DbErrorRow {
  eid: number;
  dbname: string;
  swid: string | null;
  cname: string;
  dtime: string;
  erquery: string | null;
  erresponse: string | null;
  erstatus: number;
  linkid: number | null;
  errorCount: number;
  error_message: string;
  databaseNames: string;
}

export interface PageResponse {
  total: number;
  items: DbErrorRow[];
}

export interface FiltersResponse {
  clients: string[];
  databases: string[];
}

export interface ErrorQuery {
  page: number;
  pageSize: number;
  search?: string;
  client?: string;
  db?: string;
  status?: string;
  from?: string;
  to?: string;
}

function pick(obj: any, name: string): any {
  if (!obj) return undefined;

  const key = Object.keys(obj).find(
    k => k.toLowerCase() === name.toLowerCase()
  );

  return key !== undefined ? obj[key] : undefined;
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private http = inject(HttpClient);
  private base = `${API_URL}/api/tp/errors`;

  getErrors(q: ErrorQuery): Observable<PageResponse> {

    let params = new HttpParams()
      .set('page', String(q.page))
      .set('pageSize', String(q.pageSize));

    if (q.search) params = params.set('search', q.search);
    if (q.client) params = params.set('client', q.client);
    if (q.db) params = params.set('db', q.db);

    if (q.status !== undefined && q.status !== '') {
      params = params.set('status', q.status);
    }

    if (q.from) params = params.set('from', q.from);
    if (q.to) params = params.set('to', q.to);

    return this.http.get<any>(this.base, { params }).pipe(
      map(r => {

        if (pick(r, 'isSuccess') === false) {
          throw new Error(
            pick(r, 'message') ?? 'Error from API'
          );
        }

        const data: any[] = pick(r, 'data') ?? [];

        return {
          total: Number(pick(r, 'totalRecords') ?? data.length),

          items: data.map(row => this.toRow(row))
        };
      })
    );
  }

  getFilters(): Observable<FiltersResponse> {
    return this.http.get<any>(`${this.base}/filters`).pipe(
      map(r => {

        const d = pick(r, 'data') ?? r;

        return {
          clients: pick(d, 'clients') ?? [],
          databases: pick(d, 'databases') ?? []
        };
      })
    );
  }

  updateStatus(eid: number, status: number): Observable<unknown> {
    return this.http.put(`${this.base}/${eid}/status`, { status });
  }

  deleteError(error_message: string): Observable<any> {
    const params = new HttpParams().set('error_message', error_message);
    return this.http.delete<any>(`${this.base}/delete-error`, { params });
  }


  private toRow(row: any): DbErrorRow {
    return {
      eid: Number(pick(row, 'ErrorId') ?? pick(row, 'eid') ?? 0),

      cname: pick(row, 'cname') ?? '',

      // FIX: SQL returns DatabaseNames
      dbname: pick(row, 'DatabaseNames')
        ?? pick(row, 'dbname')
        ?? '',

      dtime: pick(row, 'dtime') ?? '',

      erquery: pick(row, 'ErrorQuery')
        ?? pick(row, 'Query')
        ?? pick(row, 'erquery')
        ?? pick(row, 'error_query')
        ?? pick(row, 'QueryText')
        ?? pick(row, 'error_message')
        ?? null,

      erresponse: pick(row, 'ErrorResponse')
        ?? pick(row, 'erresponse')
        ?? null,

      erstatus: Number(pick(row, 'erstatus') ?? 0),

      swid: pick(row, 'swid') ?? null,

      linkid: pick(row, 'linkid') ?? null,

      errorCount: Number(pick(row, 'ErrorCount') ?? 0),

      error_message: pick(row, 'error_message') ?? '',

      databaseNames: pick(row, 'DatabaseNames') ?? ''
    };
  }

}
