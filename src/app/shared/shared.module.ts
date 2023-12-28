import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TableComponent } from './components/table/table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardComponent } from './components/card/card.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/form/form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { PanelComponent } from './components/panel/panel.component';
import { FileComponent } from './components/file/file.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './components/camera/camera.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

import {NgxMatTimepickerModule} from 'ngx-mat-timepicker'; 

//test
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

//test autocomplete
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    TableComponent,
    CardComponent,
    FormComponent,
    PanelComponent,
    FileComponent,
    CameraComponent,
    SnackbarComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatListModule,
    MatExpansionModule,
    WebcamModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    AsyncPipe,
    MatSlideToggleModule,
    NgxMatTimepickerModule
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    TableComponent,
    CardComponent,
    FormsModule,
    FileComponent,
    ReactiveFormsModule,
    FormComponent,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatBottomSheetModule,
    WebcamModule
  ]
})
export class SharedModule { }
