import { Component, ElementRef, Input, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color, Pos, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

@Component({
  selector: '[app-color-wheel]',
  templateUrl: './color-wheel.html',
  styleUrls: ['./color-wheel.scss']
})
export class ColorWheelComponent {

  @Input() center: Pos

  @Input() set tone(tone: Tone) {
    this._tone = tone;

    if (tone && this.center) {
      
      this.colors = this.colorService.createColorsByPccs(tone);
      this.createColorPath();
      this.zone.run(() => {
        this.refreshGuideline();
      });
    }
  }

  get tone(): Tone {
    return this._tone;
  }

  @Input() controllable: boolean = false

  @Input() colorWheelSize: number = 50

  @Input() colorWheelWidth: number = 10

  @Input() colorWheelPadding: number = 2

  @Input() set initialColors(initialColors: Color[]) {
    if (initialColors) {
      console.log('initialColors', initialColors);
      setTimeout(() => {
        this.colors = initialColors;
        this.createColorPath();
        this.zone.run(() => {
          this.refreshGuideline();
        });
      }, 1000);
    }
  }

  @Input() showOutline: boolean = false

  private _tone: Tone = 'V'

  private selectedColorChanged$: Subscription = null

  /** 色セット */
  colors: Color[] = []

  mainColorPos: Pos = null

  path: string = ''

  guidelinePaths: string[] = []

  guidelinePoints: string[] = []

  guidelineLines: { x1: number, y1: number, x2: number, y2: number, show: boolean }[] = []

  get hoveredColor(): Color {
    return this.colorService.hoveredColor;
  }

  set hoveredColor(hoveredColor: Color) {
    this.colorService.hoveredColor = hoveredColor;
  }

  get selectedColors(): Color[] {
    return this.colorService.selectedColors;
  }

  set selectedColors(selectedColors: Color[]) {
    this.colorService.selectedColors = selectedColors;
  }

  // get colors(): Color[] {
  //   return this.colorService.colors;
  // }
  
  constructor(private colorService: ColorService, private zone: NgZone) {
    this.selectedColorChanged$ = this.colorService.selectedColorChanged.subscribe(() => {
      if (this.controllable) this.refreshGuideline();
    });
  }

  ngOnInit(): void {
    this.colors = this.colorService.createColorsByPccs(this.tone);
    this.createColorPath();
  }

  ngOnDestroy(): void {
    if (!this.selectedColorChanged$) this.selectedColorChanged$.unsubscribe();
  }

  /**
   * 配色のガイドライン線を描画する
   */
  private refreshGuideline(): void {
    this.guidelinePaths = [];
    this.guidelinePoints = [];
    this.guidelineLines.forEach(line => { line.show = false });
    if (this.selectedColors.length > 0) {

      const posList: Pos[] = [];

      // console.log('refreshGuideline', this.selectedColors[0]?.color, /* this.colors.map(c => c.color)*/);
      // console.log('refreshGuideline', this.colors, this.selectedColors);

      this.selectedColors.forEach(color => {
        let idx = this.colors.findIndex(c => c.color == color.color);
        if (idx === -1) idx = this.colorService.idxInTone(color);
        console.log('idx', idx);
        // if (!this.colors.find(c => c.color == color.color)) return;
        if (idx === -1) return;
        const d = hue2Degree(idx /*this.colors.findIndex(c => c.color == color.color)*/ * (360 / this.colors.length) /* color.h */);
        const inner = this.colorWheelSize - this.colorWheelWidth - this.colorWheelPadding * 2;

        const rad = radian(d);
        const pos = { x: Math.cos(rad) * inner, y: Math.sin(rad) * inner * -1 };
        posList.push(pos);
      });
      posList.forEach(p => { p.x += this.center.x; p.y += this.center.y; });

      switch(this.colorService.selectionMode) {
        case '単一色':
        case '補色': // 補色
        case '対照色': // 対照色
        case 'トライアド': // トライアド
        case 'テトラード':  // テトラード
        case '類似色':
        case '色相コントラスト':
        case 'トーンコントラスト':
        case 'トーンオントーン':
        case 'トーンコントラスト3色':
        case 'トライアド＋トーンコントラスト':
        case '対照色＋トーンコントラスト':
        case 'ドミナントカラー': { 
          // path
          const pathD = `M ${posList.map(p => `${p.x} ${p.y}`).join(' L ')} Z`;
          this.guidelinePaths.push(pathD);
          // polygon
          const polygonPoints = `${posList.map(p => `${p.x},${p.y}`).join(' ')}`;
          this.guidelinePoints.push(polygonPoints);
          // line
          posList.forEach((p, i, arr) => {
            if (!this.guidelineLines[i]) {
              this.guidelineLines.push({
                x1: null,
                y1: null,
                x2: null,
                y2: null,
                show: false
              });
            }
            const line = this.guidelineLines[i];
            line.x1 = p.x;
            line.y1 = p.y;
            line.x2 = this.center.x;
            line.y2 = this.center.y;
            line.show = true;
            // const nextP = arr[i + 1] || arr[0];
            // const line = this.guidelineLines[i];
            // line.x1 = p.x;
            // line.y1 = p.y;
            // line.x2 = nextP.x;
            // line.y2 = nextP.y;
            // line.show = true;
          });
          break;
        }
      }
      // メインカラーの目印
      if (posList[0]) this.mainColorPos = { x: posList[0].x, y: posList[0].y };
    }

    function hue2Degree(degree: number): number {
      return (degree + 90) % 360;
    }

    function radian(degree: number): number {
      return degree * ( Math.PI / 180 ) ;
    }

  }

  /**
   * 色見本のパスを生成する
   */
  private createColorPath(): void {
    const __this = this;
    // 外径
    const outer = this.colorWheelSize;
    // 内径
    const inner = this.colorWheelSize - this.colorWheelWidth;

    this.colors.forEach(c => {
      c.pathD = createPath(c);
    });

    function createPath(color: Color): string {
      const d = hue2Degree(__this.colors.indexOf(color) * (360 / __this.colors.length) /*color.h*/);
      const delta = (360 / __this.colors.length / 2) - (__this.colorWheelPadding / 2);
      const posList: Pos[] = [];

      for (let degree of [ d - delta, d + delta ]) {
        const rad = radian(degree);
        const pos = { x: Math.cos(rad) * outer, y: Math.sin(rad) * outer * -1 };
        posList.push(pos);
      }
  
      for (let degree of [ d + delta, d - delta ]) {
        const rad = radian(degree);
        const pos = { x: Math.cos(rad) * inner, y: Math.sin(rad) * inner * -1 };
        posList.push(pos);
      }
      posList.forEach(p => { p.x += __this.center.x; p.y += __this.center.y; });

      const [ p1, p2, p3, p4 ] = posList;
      return `M ${p1.x} ${p1.y} A ${outer} ${outer} 0 0 0 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${inner} ${inner} 0 0 1  ${p4.x} ${p4.y} Z`;
    }

    function radian(degree: number): number {
      return degree * ( Math.PI / 180 ) ;
    }

    function hue2Degree(degree: number): number {
      return (degree + 90) % 360;
    }
  }

  colorStyle(color: Color): Object {
    return {
      // stroke: '#FFFFFF',
      // 'stroke-width': '1px',
      fill: color.color
    }
  }

  selected(color: Color): boolean {
    return this.colorService.selectedColors?.includes(color);
  }

  selectColor(color: Color): void {
    this.colorService.selectColor(color, this.colors, this.tone);
  }
}
