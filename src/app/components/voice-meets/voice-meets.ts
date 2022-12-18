import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Color, Pos, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

declare interface ToneGroup {
  name: Tone
  longName: string
  description: string
  s: number
  l: number
  selectedColors?: Color[]
}

@Component({
  selector: 'app-voice-meets',
  templateUrl: './voice-meets.html',
  styleUrls: ['./voice-meets.scss']
})
export class VoiceMeetsComponent {

  freeColorCode: string = '#000000'

  get baseColor(): string {
    return this.colorService.contentColorMap.get('Base');
  }

  get main1Color(): string {
    return this.colorService.contentColorMap.get('Main1');
  }

  get main2Color(): string {
    return this.colorService.contentColorMap.get('Main2');
  }

  get accentColor(): string {
    return this.colorService.contentColorMap.get('Accent');
  }

  get logoColor(): string {
    return this.colorService.contentColorMap.get('Logo');
  }

  get textColor(): string {
    return this.colorService.contentColorMap.get('Text');
  }

  get headerTextColor(): string {
    return this.colorService.contentColorMap.get('HeaderText');
  }

  constructor(private colorService: ColorService) {

  }

  dragStart(event: DragEvent, color: string): void {
    event.dataTransfer.setData('text/plain', color);
  }

  input(event: Event) {
    const elm = event.target as HTMLDivElement;
    // 仮のエレメントを作り、張り付けた内容にimgタグがあるか探す
    var temp = document.createElement("div");
    temp.innerHTML = elm.innerHTML;
    var pastedImage = temp.querySelector("img");

    // イメージタグがあればsrc属性からbase64が得られるので
    // あとは煮るなり焼くなり
    // if (pastedImage) {
    //     var base64 = pastedImage.src;

    //     (document.querySelector("#outputImage") as HTMLImageElement).src = base64;
    //     // document.querySelector("#outputText").textContent = base64;
    // }

    // contenteditableの内容は戻しておく
    // elm.innerHTML = "paste image here";    
  }
}
