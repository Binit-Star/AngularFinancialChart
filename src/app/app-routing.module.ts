import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialChartComponent } from "./financial-chart/financial-chart.component";

const routes: Routes = [
  {  
    path: 'LineChart', component: FinancialChartComponent  
  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
