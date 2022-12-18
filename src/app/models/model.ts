export interface Color {
    color: string
    rgb: string
    h: number
    s: number
    l: number
    r: number
    g: number
    b: number
    pathD: string
}

export interface Pos {
    x: number
    y: number
}

export type SelectionMode =
    /** 単色 */
    '単一色' |
    /** 補色 */
    '補色' |
    /** 対照色(補色トライアド) */
    '対照色' | 
    /** トライアド */
    'トライアド' |
    /** テトラード */
    'テトラード' |
    /** 類似色 */
    '類似色' |
    /** ドミナントトーン */
    'ドミナントカラー' |
    '色相コントラスト' |
    'トーンコントラスト' |
    'トーンオントーン' |
    'トーンコントラスト3色' | 
    'トライアド＋トーンコントラスト' |
    '対照色＋トーンコントラスト'

    

/** トーン */
export type Tone = 'V' | 'b' | 's' | 'dp' | 'lt' | 'sf' | 'd' | 'dk' | 'P' | 'ltg' | 'g' | 'dkg' | 'W' | 'ltGr' | 'mGr' | 'dkGr' | 'BK'

/** コンテンツ内色種別 */
export type ContentColorType = 
    /** ベースカラー */
    'Base' | 
    /** メインカラー１ */
    'Main1' | 
    /** メインカラー２ */
    'Main2' | 
    /** アクセントカラー */
    'Accent' | 
    'Logo' |
    'Text' |
    'HeaderText'