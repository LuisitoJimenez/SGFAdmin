import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CardModel } from 'src/app/models/CardModel';

export interface CardData {
  id: number
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input()
  set imageSrc(value: { url: string, itemId: number }) {
    this._imageSrc = value;
    this.onDataLoaded();
  }
  get imageSrc() {
    return this._imageSrc;
  }

  private _cardData!: { [key: string]: any };
  @Input()
  set cardData(value: { [key: string]: any }) {
    this._cardData = value;
    this.onDataLoaded();
  }
  get cardData() {
    return this._cardData;
  }

  @Input() cardDefinition: CardModel = {} as CardModel;

  @Output() deleteItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() editItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataLoaded: EventEmitter<void> = new EventEmitter<void>();
  @Output() loadingComplete: EventEmitter<void> = new EventEmitter<void>();

  private _imageSrc!: { url: string, itemId: number };
  cardTitle: string = '';
  cardSubtitle: string = '';
  cardImage: string = '';
  itemId: number = 0;
  showProgressBar = true;
  progress = 0;
  totalData = 2;
  loadedData = 0;

  ngOnInit(): void {
    if (this.cardDefinition.title in this.cardData) {
      this.cardTitle = this.cardData[this.cardDefinition.title];
    }
    if (this.cardDefinition.subtitle in this.cardData) {
      this.cardSubtitle = this.cardData[this.cardDefinition.subtitle];
    }
    this.dataLoaded.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('imageSrc' in changes && this.imageSrc && this.cardData['id'] === this.imageSrc.itemId) {
      this.cardImage = this.imageSrc.url;
    }
  }

  isUrl(str: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
  }

  onDataLoaded() {
    this.loadedData++;
    this.progress = (this.loadedData / this.totalData) * 100;
    if (this.progress === 100) {
      setTimeout(() => {
        this.showProgressBar = false;
      }, 500);
    }
  }

}
