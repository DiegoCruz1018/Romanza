import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { OrdersService } from '../../orders/orders.service';
import { OrderDTO } from '../../orders/Orders';
import { ListGenericComponent } from "../../shares/list-generic/list-generic.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HelpersService } from '../../shares/functions/helpers.service';
import { SecurityService } from '../../security/security.service';
import { UserDTO } from '../../security/security';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideCharts, NgChartsConfiguration } from 'ng2-charts'; // Importación correcta
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-index-sales',
  imports: [ListGenericComponent, MatTableModule, MatDatepickerModule, MatFormFieldModule, FormsModule, MatInputModule, BaseChartDirective],
  templateUrl: './index-sales.component.html',
  styleUrl: './index-sales.component.css',
  providers: [DatePipe, 
    provideCharts({} as NgChartsConfiguration) // Proveedor correcto para ng2-charts 8.0.0
  ],
})
export class IndexSalesComponent implements OnInit{

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective; // Referencia al gráfico

  ngOnInit(): void {
    this.getSales();
    this.getUsers();
  }

  private ordersService = inject(OrdersService);
  private userService = inject(SecurityService);
  private helpersService = inject(HelpersService);
  private datePipe = inject(DatePipe);

  //sales: MatTableDataSource<OrderDTO> = new MatTableDataSource<OrderDTO>([]);
  sales: OrderDTO[] = [];
  users: UserDTO[] = [];

  columnsToShow = ['id', 'user', 'client', 'detalles', 'total', 'date'];
  totalSales: number = 0;

  // startDate: Date | null = null;
  // endDate: Date | null = null;
  start: Date | null = new Date(new Date().getFullYear(), new Date().getMonth(), 1); //Primer dia del mes
  end: Date | null = new Date();

  constructor() {
    Chart.register(...registerables);
  }

  //Configuración del gráfico
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    //maintainAspectRatio: false, //Permite que el gráfico llene el contenedor
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  public barChartType: 'bar' = 'bar';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [0],
        label: 'Ventas',
        backgroundColor: 'rgb(215, 5, 5, 0.5)',
      }
    ]
  }

  getSales(){
    if(this.start && this.end){

      const startDate = this.start.toISOString().split('T')[0];
      const endDate = this.end.toISOString().split('T')[0];

      this.ordersService.get('todas', {
        startDate,
        endDate
      }).subscribe((response) => {
        //const filteredSales = response.body as OrderDTO[];
        //this.sales.data = filteredSales;
        //console.log(this.sales.data);
        this.sales = response.body as OrderDTO[];
        this.totalSales = this.getTotalSales();
        //console.log(this.totalSales);

        //Datos para la gráfica
        // Verifica si hay datos
        if (this.sales.length > 0) {
          this.barChartData.labels = this.sales.map(s => this.formatDate(typeof s.dateCreated === 'string' ? s.dateCreated : s.dateCreated.toISOString()));
          this.barChartData.datasets[0].data = this.sales.map(s => s.total);
        } else {
          // Si no hay datos, muestra un estado predeterminado
          this.barChartData.labels = ['Sin datos'];
          this.barChartData.datasets[0].data = [0];
        }

        this.chart?.update(); // Actualiza el gráfico con los nuevos datos
      });
    }
  }

  getUsers(){
    this.userService.getAll().subscribe((response) => {
      this.users = response.body as UserDTO[];
      //console.log(this.users);
    });
  }

  getUserValue(id: string, value: keyof UserDTO): string | number | Date | string[]{
    return this.helpersService.getItemValue(this.users, id, value) ?? '';
  }

  getTotalSales(): number{
    return this.sales.reduce((total, sale) => total + sale.total, 0);
  }

  formatPrice(price: number){
    return this.helpersService.formatPrice(price);
  }

  formatDate(date: string): string{
    return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '';
  }
}
