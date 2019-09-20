import {RabbitsComponent} from './rabbits/rabbits.component';
import {OverviewComponent} from './overview/overview.component';
import {CreateComponent} from './create/create.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule }             from '@angular/core';


const rabbitsRoutes: Routes = [
  {
    path: 'rabbits', component: RabbitsComponent, children: [
      { path: '', component: OverviewComponent },
      { path: 'create', component: CreateComponent },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(rabbitsRoutes) ],
  exports: [ RouterModule ]
})
export class RabbitRoutingModule {}
