import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Report {
  UserId: number;
  Latitude: number;
  Longitude: number;
  Address: string;
  Comments: string;
}

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  reports: Report[] = []; // Inicialmente vacío
  private apiUrl = 'https://cityalertapi-dev.azurewebsites.net/geo/geomarks?userid=1';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void {
    this.http.get<Report[]>(this.apiUrl).subscribe(
      (data) => {
        this.reports = data; // Asigna los datos recibidos a la variable 'reports'
      },
      (error) => {
        console.error('Error al obtener los reportes:', error);
      }
    );
  }

}
