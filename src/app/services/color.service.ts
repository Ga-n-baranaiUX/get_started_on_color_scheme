import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Color, ContentColorType, SelectionMode, Tone } from "../models/model";
import { Util } from "../utils/Util";

@Injectable({
    providedIn: 'root'
})
export class ColorService {

    /** 選択中の色 */
    private _selectedColors: Color[] = []
    /** ホバー中の色 */
    hoveredColor: Color = null
    /** 選択モード */
    private _selectionMode: SelectionMode = '単一色'
    /** 選択中のトーン */
    private _selectedTone: Tone = 'V'

    private _beforeColors: Color[] = null

    contentColorMap: Map<ContentColorType, string> = new Map([
      [ 'Base', '#FFFFFF' ], [ 'Main1', '#00FF00' ], [ 'Main2', '#00AA00' ], [ 'Accent', '#FF0000' ], [ 'Logo', '#FFFFFF' ], [ 'Text', '#000000' ], [ 'HeaderText', '#000000' ]
    ]);

    selectedColorChanged: Subject<void> = new Subject()

    get selectedColors(): Color[] {
        return this._selectedColors;
    }

    set selectedColors(selectedColors: Color[]) {
        this._selectedColors = selectedColors;
    }

    get selectedTone(): Tone {
      return this._selectedTone;
    }

    set selectedTone(selectedTone: Tone) {
      this._selectedTone = selectedTone;
      if (this.selectedColors?.length && this._beforeColors) {
        // カラーセットを変更
        if (this.selectionMode === 'ドミナントカラー') {
          this.selectedColors = [ this.selectedColors.find(c => this._beforeColors.find(c2 => c2.color === c.color)) ];
        }
        const selectedColorIndexs = this.selectedColors.map(c => this._beforeColors.findIndex(c2 => c2.color === c.color));
        const colors = this.createColorsByPccs(selectedTone);
        this.selectedColors = selectedColorIndexs.map(i => colors[i]);
        this.selectColor(this.selectedColors[0], colors, this.selectedTone);
      }
    }

    get selectionMode(): SelectionMode {
      return this._selectionMode; 
    }

    set selectionMode(selectionMode: SelectionMode) {
      this._selectionMode = selectionMode;
      if (this.selectedColors?.length && this._beforeColors) this.selectColor(this.selectedColors[0], this._beforeColors, this.selectedTone);
    }

    constructor() {
        // colors = this.createColorsByPccs('V');
    }

    selectColor(color: Color, colors: Color[], tone: Tone): void {
        // console.log('selectColor', this.selectionMode, color);
        switch(this.selectionMode) {
            case '単一色': {
                this.selectedColors = [ color ];
                break;
            }
            case '色相コントラスト':
            case '補色': {
                // 補色
                const idx1 = colors.indexOf(color);
                const idx2 = (idx1 + colors.length / 2) % colors.length;
                this.selectedColors = [ colors[idx1], colors[idx2] ];
                break;
            }
            case '対照色': {
                // 対照色
                const idx1 = colors.indexOf(color);
                const idx2 = ((idx1 + colors.length / 2) - 1) % colors.length;
                const idx3 = ((idx1 + colors.length / 2) + 1) % colors.length;
                this.selectedColors = [ colors[idx1], colors[idx2], colors[idx3] ];
                break;
            }
            case 'トライアド': {
                const idx1 = colors.indexOf(color);
                const idx2 = (idx1 + colors.length / 3) % colors.length;
                const idx3 = (idx1 + (colors.length / 3) * 2) % colors.length;
                this.selectedColors = [ colors[idx1], colors[idx2], colors[idx3] ];
                break;
            }
            case 'テトラード': {
                const idx1 = colors.indexOf(color);
                const idx2 = (idx1 + colors.length / 4) % colors.length;
                const idx3 = (idx1 + (colors.length / 4) * 2) % colors.length;
                const idx4 = (idx1 + (colors.length / 4) * 3) % colors.length;
                this.selectedColors = [ colors[idx1], colors[idx2], colors[idx3], colors[idx4] ];
                break;
            }
            case '類似色': {
                // 同一トーンの色相違い
                const idx1 = colors.indexOf(color);
                const idx2 = ((idx1 + colors.length - 1) % colors.length);
                const idx3 = ((idx1 + 1) % colors.length);
                this.selectedColors = [ colors[idx1], colors[idx2], colors[idx3] ];
              break;
            }
            case 'ドミナントカラー': {
              // 同一色相のトーン違い
              const idx = colors.indexOf(color);
              const nearTones: Tone[] = Util.nearTones(tone);
              const dominantColors = nearTones.map(nt => {
                const colors = this.createColorsByPccs(nt);
                return colors[idx];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            case 'トーンコントラスト': {
              // 明度・彩度が離れたトーン（2色）
              const idx = colors.indexOf(color);
              const nearTones: Tone[] = Util.contrastTones(tone);
              const dominantColors = nearTones.map(nt => {
                const colors = this.createColorsByPccs(nt);
                return colors[idx];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            case 'トーンコントラスト3色': {
              // 明度・彩度が離れたトーン（3色）
              const idx = colors.indexOf(color);
              const nearTones: Tone[] = Util.threeContrastTones(tone);
              const dominantColors = nearTones.map(nt => {
                const colors = this.createColorsByPccs(nt);
                return colors[idx];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            case 'トライアド＋トーンコントラスト': {
              // 明度・彩度が離れたトーン（3色）
              const idx1 = colors.indexOf(color);
              const idx2 = (idx1 + colors.length / 3) % colors.length;
              const idx3 = (idx1 + (colors.length / 3) * 2) % colors.length;
              const indexes = [ idx1, idx2, idx3 ];
              const nearTones: Tone[] = Util.threeContrastTones(tone);
              const dominantColors = nearTones.map((nt, i) => {
                const colors = this.createColorsByPccs(nt);
                return colors[indexes[i]];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            case '対照色＋トーンコントラスト': {
              // 明度・彩度が離れたトーン（3色）
              const idx1 = colors.indexOf(color);
              const idx2 = ((idx1 + colors.length / 2) - 1) % colors.length;
              const idx3 = ((idx1 + colors.length / 2) + 1) % colors.length;
              const indexes = [ idx1, idx2, idx3 ];
              const nearTones: Tone[] = Util.threeContrastTones(tone);
              const dominantColors = nearTones.map((nt, i) => {
                const colors = this.createColorsByPccs(nt);
                return colors[indexes[i]];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            case 'トーンオントーン': {
              // 明度・彩度が離れたトーン（2色）
              const idx = colors.indexOf(color);
              const nearTones: Tone[] = Util.toneOnTone(tone);
              const dominantColors = nearTones.map(nt => {
                const colors = this.createColorsByPccs(nt);
                return colors[idx];
              });
              this.selectedColors = [ color, ...dominantColors.filter(c => c.color !== color.color) ];
              break;
            }
            default:
                this.selectedColors = [ color ];
                break;
        }
        this._beforeColors = colors;
        this.selectedColorChanged.next();
        // console.log(this.selectedColors);
    }

    /**
     * PCCS色見本を生成する
     */
    createColorsByPccs(tone: string): Color[] {
      const colors = [];
      Object.keys(Util.hslColors).forEach((t) => {
        if (t === tone) {
          Util.hslColors[t].forEach((hsl, idx) => {
            if (idx % 2 === 0) {
              const rgb = Util.hsl2rgb(hsl.h, hsl.s, hsl.l);
              // console.log('rgb', rgb);
              const color: Color = { 
                color: hsl.hsl,
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                rgb: null,
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                pathD: null
              }  
              colors.push(color);
            }  
          });
        }
      });
      return colors;
    }

    /**
     * 三原色から間をRGB色相環で補完した色見本を生成する
     */
    createColorsByRGBPrimaryColor(): Color[] {
        const colors = [];
    
        // 赤、黄、青の3原色とその中間色から作成した色相環
        // HUE 0, 60, 240がそれぞれ赤、黄、青を表す(WEB)
        let primaryColors = [ 0, 60, 240 ];
        primaryColors = twice(primaryColors, 2);
        // primaryColors = primaryColors.reverse();
        primaryColors = loopShift(primaryColors, 0);
    
        for (let i = 0; i < 12; i++) {
          colors.push({ 
            color: `hsl(${primaryColors[i]}deg 100% 50%)`,
            // color: `hsl(${i * 30}deg 80% 50%)`,
            h: i * 30,
            rgb: null,
            r: null,
            g: null,
            b: null,
            pathD: null
          });
        }

        return colors;
    
        function twice(source: number[], times: number): number[] {
          if (source.length < 2) return source;
          let result = [ ...source ];
          for (let t = 0; t < times; t++) {
            let newResult = [];
            result.forEach((cur, i, arr) => {
              newResult.push(cur);
              const next = arr[i + 1];
              if (next !== undefined) {
                newResult.push((cur + next) / 2);
              } else {
                newResult.push((cur + arr[0] + 360) / 2);
              }
            });
            result = newResult;
          }
          return result;
        }
    
        function loopShift(source: any[], times: number): any[] {
          if (source.length < 2) return source;
          let result = [ ...source ];
          for (let t = 0; t < times; t++) {
            let newResult = [ ...result, ...result ].slice(source.length - 1, source.length + source.length - 1);
            result = newResult;
          }
          return result;
        }
    }
    
    public idxInTone(color: Color): number {
      for (let [ tone ] of Object.entries(Util.hslColors)) {
          const colors = this.createColorsByPccs(tone);
          const idx = colors.findIndex(c => c.color === color.color);
          if (idx > -1) return idx;
      }
      return -1;
  }

}