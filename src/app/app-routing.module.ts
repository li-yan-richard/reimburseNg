import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReimburseComponent } from "./reimburse/reimburse.component";

const routes: Routes = [
  {path:'', component:ReimburseComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
