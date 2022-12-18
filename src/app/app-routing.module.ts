import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorDescriptionsComponent } from './components/color-descriptions/color-descriptions';
import { ColorWheelComponent } from './components/color-wheel/color-wheel';
import { HomeViewComponent } from './views/home-view';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent
  },
  {
    path: 'color-descriptions',
    component: ColorDescriptionsComponent
  },
  // {
  //   path: '**',
  //   redirectTo: ''
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
