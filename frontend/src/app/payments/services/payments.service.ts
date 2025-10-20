import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Payment {
  id: number;
  name: string;
  status: 'pending' | 'paid' | 'failed';
  payment_date: string;
  expense_id: number;
}
@Injectable({
  providedIn: 'root'
})

export class PaymentService{
  private apiUrl = 'http://localhost:8080/api/v1/payments';


  constructor(private http: HttpClient) {}

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }
  update(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${id}`, payment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }
}
