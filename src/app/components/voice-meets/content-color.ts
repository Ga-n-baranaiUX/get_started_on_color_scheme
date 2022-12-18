import { Component, ContentChild, ElementRef, HostBinding, Input, NgZone, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color, ContentColorType, Pos, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

@Component({
  selector: 'app-content-color',
  templateUrl: './content-color.html',
  styleUrls: ['./content-color.scss']
})
export class ContentColorComponent {

  @ViewChild('contenColorElm') contentColorRef: ElementRef

  @Input() set type(type: ContentColorType) {
    this._type = type;
  }

  get type(): ContentColorType {
    return this._type;
  }

  private _type: ContentColorType = null

  // color: string = ''

  draggingOver: boolean = false

  colorText: string = ''

  get color(): string {
    return this.colorService.contentColorMap.get(this._type);
  }

  constructor(private colorService: ColorService, private zone: NgZone) {}

  ngOnInit(): void {
    this.setColorText();
  }

  dragOver(event: MouseEvent): void {
    event.preventDefault();
    this.draggingOver = true;
  }

  dragOut(): void {
    this.draggingOver = false;    
  }

  drop(event: DragEvent): void {
    console.log('drop', event);
    const color = event.dataTransfer.getData('text/plain');
    console.log('drop', color);
    this.draggingOver = false;
    this.colorService.contentColorMap.set(this._type, color);
    this.colorService.contentColorMap = this.colorService.contentColorMap;

    this.setColorText();
    event.preventDefault();
  }

  private setColorText(): void {
    setTimeout(() => {
      this.zone.run(() => {
        const backgroundColor = (this.contentColorRef?.nativeElement as HTMLDivElement)?.style.backgroundColor;
        if (backgroundColor) {
          let [ r, g, b ] = backgroundColor.replace('rgb(', '').replace(')', '').split(',').map(i => parseFloat(i));
          this.colorText = `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`.toUpperCase();
        }
      });  
    }, 50);
  }

}
