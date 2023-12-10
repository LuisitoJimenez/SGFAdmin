import { AccessService } from 'src/app/services/access.service';
import { ModuleModel } from '../../models/module';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  mobileQuery: MediaQueryList;
  showFiller = false;
  shouldRun = true;
  menuItems: ModuleModel[] = [];

  private _mobileQueryListener: () => void;

  constructor(
    private accessService: AccessService,
    changeDetectorRef: ChangeDetectorRef,
  ) {
    this.mobileQuery = matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  getModules() {
    this.accessService.getModules().subscribe({
      next: (modules: ModuleModel[]) => {
        this.menuItems = modules;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.getModules();
  }
}
