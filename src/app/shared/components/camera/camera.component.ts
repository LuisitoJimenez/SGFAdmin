import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements OnInit {

  public showWebcam = true
  public allowCameraSwitch = true;
  public multipleWebcamAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  public hiddenWebCam = true;
  public webcamImage: WebcamImage | null = null;
  public message: string = 'click para agrandar la imagen';
  public pictureTaken: WebcamImage | null = null;
  public isWebcamLoaded = false;
  public disabledCaptureBtn = false;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  private videoElement: HTMLVideoElement | null = null;

  @ViewChild('image') image!: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<CameraComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public formData: any
  ) { }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamAvailable = mediaDevices && mediaDevices.length > 1;
    });
    this.videoElement = document.querySelector('video');
  }

  public ngOnDestroy(): void {
    if (this.videoElement && this.videoElement.srcObject) {
      const stream: MediaStream = this.videoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.videoElement.srcObject = null;
    }
  }

  toggleImageSize() {
    if (this.image.nativeElement.style.width === '470px') {
      this.image.nativeElement.style.width = '150px';
      this.image.nativeElement.style.height = 'auto';
      this.message = 'Click para agrandar la imagen';
      this.disabledCaptureBtn = false;
    } else {
      this.image.nativeElement.style.width = '470px'
      this.image.nativeElement.style.height = 'auto'
      this.message = 'Click para reducir la imagen';
      this.disabledCaptureBtn = true;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(this.pictureTaken);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: { message: 'Captura exitosa', snackIcon: 'check_circle', iconColor: 'green'},
      duration: 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['center-message']
    });
    this.pictureTaken = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.isWebcamLoaded = true;
    this.hiddenWebCam = false;
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
