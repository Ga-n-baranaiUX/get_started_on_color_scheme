import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color, Pos, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

declare interface ToneGroup {
  name: Tone
  longName: string
  description: string[]
  s: number
  l: number
  selectedColors?: Color[]
}

@Component({
  selector: '[app-tones]',
  templateUrl: './tones.html',
  styleUrls: ['./tones.scss']
})
export class TonesComponent {

  @Input() showColors: boolean = true

  @Input() showDescription: boolean = false

  toneGroups: ToneGroup[] = [
    { name: 'V', s: 100, l: 50, longName: 'ビビッド', description: [ '活気のある', '積極的な', '派手な'] },

    { name: 'b', s: 75, l: 75, longName: 'ブライト', description: [ '陽気な', '楽しい', '快活な'] },
    { name: 's', s: 75, l: 50, longName: 'ストロング', description: [ '情熱的な', '豊かな', '活動的な'] },
    { name: 'dp', s: 75, l: 25, longName: 'ディープ', description: [ '深い', '伝統的な', '和風の'] },

    { name: 'lt', s: 50, l: 90, longName: 'ライト', description: [ '爽やかな', '澄んだ', '若々しい'] },
    { name: 'sf', s: 50, l: 64, longName: 'ソフト', description: [ '穏やかな', '上品な', '和やかな'] },
    { name: 'd', s: 50, l: 37, longName: 'ダル', description: [ 'ぼんやりした', '鈍い', '濁った'] },
    { name: 'dk', s: 50, l: 10, longName: 'ダーク', description: [ '重厚な', '円熟した', '丈夫な'] },

    { name: 'P', s: 25, l: 95, longName: 'ペール', description: [ '弱い', '優しい', '繊細な'] },
    { name: 'ltg', s: 25, l: 65, longName: 'ライトグレイッシュ', description: [ '落ち着いた', '控えめな', '大人しい'] },
    { name: 'g', s: 25, l: 35, longName: 'グレイッシュ', description: [ '地味な', '渋い', 'シックな'] },
    { name: 'dkg', s: 25, l: 5, longName: 'ダークグレイッシュ', description: [ '高尚な', '格調ある', '堅実な'] },

    { name: 'W', s: -5, l: 100, longName: 'ホワイト', description: [ '', '', ''] },
    { name: 'ltGr', s: -5, l: 75, longName: 'ライトグレイ', description: [ '', '', ''] },
    { name: 'mGr', s: -5, l: 50, longName: 'ミディアムグレイ', description: [ '', '', ''] },
    { name: 'dkGr', s: -5, l: 25, longName: 'ダークグレイ', description: [ '', '', ''] },
    { name: 'BK', s: -5, l: 0, longName: 'ブラック', description: [ '', '', ''] },

  ];

  displayToneGroups: ToneGroup[] = []

  // toneGroups: ToneGroup[] = [
  //   { name: 'V', s: 100, l: 50, longName: 'ビビッド', description: [ '', '', ''] },

  //   { name: 'b', s: 75, l: 75, longName: 'ブライト', description: [ '', '', ''] },
  //   { name: 's', s: 75, l: 50, longName: 'ストロング', description: [ '', '', ''] },
  //   { name: 'dp', s: 75, l: 25, longName: 'ディープ', description: [ '', '', ''] },

  //   { name: 'lt', s: 50, l: 80, longName: 'ライト', description: [ '', '', ''] },
  //   { name: 'sf', s: 50, l: 60, longName: 'ソフト', description: [ '', '', ''] },
  //   { name: 'd', s: 50, l: 40, longName: 'ダル', description: [ '', '', ''] },
  //   { name: 'dk', s: 50, l: 20, longName: 'ダーク', description: [ '', '', ''] },

  //   { name: 'P', s: 25, l: 80, longName: 'ペール', description: [ '', '', ''] },
  //   { name: 'ltg', s: 25, l: 60, longName: 'ライトグレイッシュ', description: [ '', '', ''] },
  //   { name: 'g', s: 25, l: 40, longName: 'グレイッシュ', description: [ '', '', ''] },
  //   { name: 'dkg', s: 25, l: 20, longName: 'ダークグレイッシュ', description: [ '', '', ''] },

  //   { name: 'W', s: 0, l: 100, longName: 'ホワイト', description: [ '', '', ''] },
  //   { name: 'ltGr', s: 0, l: 75, longName: 'ライトグレイ', description: [ '', '', ''] },
  //   { name: 'mGr', s: 0, l: 50, longName: 'ミディアムグレイ', description: [ '', '', ''] },
  //   { name: 'dkGr', s: 0, l: 25, longName: 'ダークグレイ', description: [ '', '', ''] },
  //   { name: 'BK', s: 0, l: 0, longName: 'ブラック', description: [ '', '', ''] },

  // ];

  private selectedColorChanged$: Subscription = null

  constructor(private colorService: ColorService, private host: ElementRef) {
    this.selectedColorChanged$ = this.colorService.selectedColorChanged.subscribe(() => {
      this.setSelectedColors();
    });
  }

  ngOnInit(): void {
    this.setDisplayData();
  }

  ngOnDestroy(): void {
    if (!this.selectedColorChanged$) this.selectedColorChanged$.unsubscribe();
  }

  setDisplayData(): void {
    this.displayToneGroups = [];
    this.toneGroups.forEach(tg => {
      const toneGroup = Object.assign({}, tg);
      toneGroup.l = 100 - tg.l; // 明度の座標系を反転させる
      toneGroup.selectedColors = [];
      this.displayToneGroups.push(toneGroup);
    });
  }

  setSelectedColors(): void {
    const toneMap: Map<string, ToneGroup> = new Map();
    this.displayToneGroups.forEach(tg => { 
      tg.selectedColors = [] 
      toneMap.set(tg.name, tg);
    });


    const colors = this.colorService.selectedColors;
    colors.forEach(c => {
      // 選択された色が属するトーンを特定する
      for (let [ tone, hlsColors] of Object.entries(Util.hslColors)) {
        for (let hlsColor of hlsColors) {
          if (c.color === hlsColor.hsl) {
            // console.log('選択色のトーンを特定', tone, c);
            toneMap.get(tone).selectedColors.push(c);      
          }
        }
      }
    });

  }

  selectTone(tone: Tone): void {
    this.colorService.selectedTone = tone;
  }

  descriptions(group: ToneGroup): string[] {
    if (group.description[0] !== '') {
      return [
        `${group.longName}`,
        `(${group.name})`,
        group.description[0],
        group.description[1],
        group.description[2]
      ]
  
    } else {
      return [
        '',
        '',
        `${group.longName}(${group.name})`,
        '',
        ''
      ]  
    }
  }

}
