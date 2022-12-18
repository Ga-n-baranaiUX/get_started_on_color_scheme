import { Component } from '@angular/core';
import { Color, SelectionMode, Tone } from 'src/app/models/model';
import { ColorService } from 'src/app/services/color.service';
import { Util } from 'src/app/utils/Util';

interface ColorDescription {
  name: string
  color: string
  textColor?: string
  imageUrl: string
  positive: string
  negative: string
  matches: string
  character?: string
}

@Component({
  selector: 'app-color-descriptions',
  templateUrl: './color-descriptions.html',
  styleUrls: ['./color-descriptions.scss']
})
export class ColorDescriptionsComponent {

  /** 色の説明 */
  descriptions: ColorDescription[] = [
    {
      name: '赤',
      color: 'red',
      imageUrl: '/assets/images/akane.png',
      positive: '情熱、勝利、愛情、積極的、衝動',
      negative: '危険、怒り、争い',
      matches: '飲食、キャンペーン',
      character: '琴葉茜'
    },
    {
      name: '黄',
      color: 'yellow',
      textColor: 'orange',
      imageUrl: '/assets/images/maki.png',
      positive: '明るい、活発、幸福、躍動、希望',
      negative: '臆病、裏切り、警告',
      matches: '食品、スポーツ',
      character: '鶴巻マキ'
    },
    {
      name: '桃',
      color: 'pink',
      imageUrl: '/assets/images/metan.png',
      positive: '可愛い、ロマンス、若い',
      negative: '幼稚、繊細、弱い',
      matches: 'ブライダル、女性向けのサイト',
      character: '四国めたん'
    },
    {
      name: '橙',
      color: 'orange',
      imageUrl: '/assets/images/one.png',
      positive: '親しみ、陽気、家庭、自由',
      negative: 'わがまま、騒々しい、軽薄',
      matches: 'コミュニティ、飲食、キッズ',
      character: 'ONE'
    },
    {
      name: '紫',
      color: 'purple',
      imageUrl: '/assets/images/yukari.png',
      positive: '高級、神秘、上品、優雅、伝統',
      negative: '不安、嫉妬、孤独',
      matches: 'ファッション、ジュエリー、占い',
      character: '結月ゆかり'
    },
    {
      name: '茶',
      color: 'brown',
      imageUrl: '/assets/images/kiritan.png',
      positive: '温もり、自然、安心、堅実、伝統',
      negative: '地味、頑固、汚い',
      matches: 'ホテル・旅館、インテリア、クラシック・レトロなサイト',
      character: '東北きりたん'
    },
    {
      name: '青',
      color: 'blue',
      imageUrl: '/assets/images/aoi.png',
      positive: '知性、冷静、誠実、清潔',
      negative: 'さみしさ、冷たい、悲しみ、臆病',
      matches: 'コーポレート、医療、化学',
      character: '琴葉葵'
    },
    {
      name: '白',
      color: 'white',
      textColor: 'gray',
      imageUrl: '/assets/images/ariel.png',
      positive: '祝福、純粋、清潔、無垢',
      negative: '空虚、殺風景な、冷たい',
      matches: '医療、ニュース、EC、美容、コーポレート',
      character: 'アリアル'
    },
    {
      name: '緑',
      color: 'green',
      imageUrl: '/assets/images/zunko.png',
      positive: '自然、平和、リラックス、若さ、エコ',
      negative: '保守的、未熟',
      matches: 'アウトドア、飲食',
      character: '東北ずん子'
    },
    {
      name: '灰',
      color: 'gray',
      imageUrl: '/assets/images/himari.png',
      positive: '実用的、穏やか、控えめ',
      negative: '曖昧、疑惑、不正、無気力',
      matches: '工業、家電、ファッション',
      character: '冥鳴ひまり'
    },
    {
      name: '黄緑',
      color: 'yellowgreen',
      imageUrl: '/assets/images/zundamon.png',
      positive: 'フレッシュ、ナチュラル、若々しい、新しい',
      negative: '未熟、子供っぽい',
      matches: '新生活、新年度、先進的なサイト',
      character: 'ずんだもん'
    },
    {
      name: '黒',
      color: 'black',
      imageUrl: '/assets/images/miriel.png',
      positive: '高級、エレガント、洗練、一流、威厳',
      negative: '恐怖、不安、絶望',
      matches: '車、ジュエリー、ファッション',
      character: 'ミリアル'
    },
  ]

  constructor(private colorService: ColorService) {}

  imageUrl(description: ColorDescription): string {
    return `url(${description.imageUrl})`;
  }

}
