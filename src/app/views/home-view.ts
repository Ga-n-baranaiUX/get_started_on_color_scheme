import { Component } from '@angular/core';
import { Color, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.html',
  styleUrls: ['./home-view.scss']
})
export class HomeViewComponent {

  viewBox: string = '-100 -100 200 200'

  tonesViewBox: string = '-30 -20 150 150'

  initialColors = this.colorService.createColorsByRGBPrimaryColor();

  initialColors0 = this.colorService.createColorsByRGBPrimaryColor().map((c,i)=> { return { color: "white", rgb: 'white', h: 0, s: 0, l: 0, r: 255, g: 255, b: 255, pathD: '' } });

  initialColors1 = this.colorService.createColorsByRGBPrimaryColor().map((c,i)=> i % 4 === 0 ? c : { color: "white", rgb: 'white', h: 0, s: 0, l: 0, r: 255, g: 255, b: 255, pathD: '' });

  initialColors2 = this.colorService.createColorsByRGBPrimaryColor().map((c,i)=> i % 2 === 0 ? c : { color: "white", rgb: 'white', h: 0, s: 0, l: 0, r: 255, g: 255, b: 255, pathD: '' });;

  initialColors3 = this.colorService.createColorsByRGBPrimaryColor();

  get selectedTone(): Tone {
    return this.colorService.selectedTone;
  }

  constructor(private colorService: ColorService) {}
}
