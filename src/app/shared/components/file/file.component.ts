import { ChangeDetectorRef, Component, ElementRef, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CameraComponent } from '../camera/camera.component';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true
    }
  ]
})
export class FileComponent implements ControlValueAccessor {

  @Input() buttonLabel = '';
  @Input() fileUrl: string | ArrayBuffer | null = null;

  fileName = '';
  isDisabled: boolean = false;
  @Input() isImageLoading = true;

  constructor(private _bottomSheet: MatBottomSheet, private cd: ChangeDetectorRef) { }

  private onTouched = () => { };

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(OptionsComponent);
    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result) {
        if (result instanceof WebcamImage) {
          this.fileUrl = result.imageAsDataUrl;
          this.onChange(this.fileUrl);
        } else if (result instanceof File) {
          this.fileName = result.name;
          const reader = new FileReader();
          reader.onload = e => this.fileUrl = reader.result;
          reader.readAsDataURL(result);
          this.onChange(result);
        }
      }
    });
  }

  writeValue(value: any): void {
    if (value) {
      this.isImageLoading = false;
      this.fileUrl = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange = (value: any) => {
    if (value) {
      const reader = new FileReader();
      reader.onload = e => {
        this.fileUrl = reader.result;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(value);
    }
  };

  onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.onChange(file);
      this.onTouched();
      const reader = new FileReader();
      reader.onload = e => {
        this.fileUrl = reader.result;
        this.cd.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

}

@Component({
  selector: 'options',
  templateUrl: 'options.html',
  standalone: true,
  imports: [MatListModule]
})
export class OptionsComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile?: File;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FileComponent>,
    public dialog: MatDialog
  ) { }

  openDialog() {
    const dialogRef = this.dialog.open(CameraComponent,
      {
        disableClose: true,
        width: '50vw',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._bottomSheetRef.dismiss(result);
      }
    });
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  openFileInput(event: MouseEvent) {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this._bottomSheetRef.dismiss(file);
    }
  }

  handleImageInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this._bottomSheetRef.dismiss(file);
    }
  }

}
