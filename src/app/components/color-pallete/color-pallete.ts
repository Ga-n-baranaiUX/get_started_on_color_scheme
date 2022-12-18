import { Component } from '@angular/core';
import { Color, SelectionMode, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

@Component({
  selector: 'app-color-pallete',
  templateUrl: './color-pallete.html',
  styleUrls: ['./color-pallete.scss']
})
export class ColorPalleteComponent {

  get hoveredColor(): Color {
    return this.colorService.hoveredColor;
  }

  set hoveredColor(hoveredColor: Color) {
    this.colorService.hoveredColor = hoveredColor;
  }

  get selectedColors(): Color[] {
    return this.colorService.selectedColors;
  }

  get selectionMode(): SelectionMode {
    return this.colorService.selectionMode;
  }

  get selectedTone(): Tone {
    return this.colorService.selectedTone;
  }

  get sortedColors(): Color[] {
    switch(this.selectionMode) {
      case '類似色': {
        return [ ...this.colorService.selectedColors ].sort((a, b) => a.h < b.h ? -1 : a.h === b.h ? 0 : 1);
      }
      case 'ドミナントカラー': {
        const nearTones = Util.nearTones(this.selectedTone);
        return [ ...this.colorService.selectedColors ].sort((a, b) => { 
          const aIdx = nearTones.indexOf(Util.toneByColor(a));
          const bIdx = nearTones.indexOf(Util.toneByColor(b));
          return aIdx < bIdx ? -1 : aIdx === bIdx ? 0 : 1 
        });
      }
      default: {
        return this.selectedColors;
      }
    }
    // return this.selectionMode === '類似色' ? 
    //   [ ...this.colorService.selectedColors ].sort((a, b) => a.h < b.h ? -1 : a.h === b.h ? 0 : 1) :
    //   this.selectedColors;
  }

  constructor(private colorService: ColorService) {}

  clickColor(event: MouseEvent): void {
    const target = event.target as HTMLDivElement;
    console.log('clickColor', target.style.backgroundColor);
  }

  floor(v :number): number {
    return Math.floor(v);
  }

  hex(color: Color): string {
    return `#${Math.floor(color.r).toString(16).padStart(2, '0')}${Math.floor(color.g).toString(16).padStart(2, '0')}${Math.floor(color.b).toString(16).padStart(2, '0')}`.toUpperCase();
  }

  dragStart(event: DragEvent, color: Color): void {
    // console.log('dragstart', color);
    event.dataTransfer.setData('text/plain', color.color);
  }

}
