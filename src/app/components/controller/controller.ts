import { Component } from '@angular/core';
import { Color, SelectionMode } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.html',
  styleUrls: ['./controller.scss']
})
export class ControllerComponent {

  modes: SelectionMode[] = [ 
    '単一色', '補色', '対照色', 
    'トライアド', 'テトラード', '類似色', 
    'ドミナントカラー', '色相コントラスト', 'トーンコントラスト', 
    'トーンオントーン', 'トーンコントラスト3色', 'トライアド＋トーンコントラスト', '対照色＋トーンコントラスト',
  ];

  get selectionMode(): SelectionMode {
    return this.colorService.selectionMode;
  }

  set selectionMode(selectionMode: SelectionMode) {
    this.colorService.selectionMode = selectionMode;
  }

  constructor(private colorService: ColorService) {}

  // change(mode: SelectionMode): void {
  //   this.selectionMode = mode;
  // }

}
