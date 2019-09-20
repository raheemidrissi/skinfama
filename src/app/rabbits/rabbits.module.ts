import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { RabbitsComponent }   from './rabbits/rabbits.component';
import { RabbitRoutingModule } from './rabbits.routes';

import {OverviewComponent}   from './overview/overview.component';
import {CreateComponent} from './create/create.component';


@NgModule({
  imports:      [ CommonModule, RabbitRoutingModule, FormsModule ],
  declarations: [ RabbitsComponent, OverviewComponent, CreateComponent ],
  providers: []
})
export class RabbitsModule { }
