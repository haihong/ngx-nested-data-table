import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { NgxDataTableComponent } from './ngx-data-table.component';

import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatCardModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ],
  declarations: [NgxDataTableComponent],
  exports: [NgxDataTableComponent],
})
export class NgxDataTableModule {}
