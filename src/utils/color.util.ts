const colorUtil = {
  /** 16进制颜色转为rgba颜色 */
  hexToRgba(hex: string, opacity?: number): string {
    let hexDowncase = hex.toLocaleLowerCase();

    // 定义常见颜色名称与十六进制颜色值的映射关系
    const colorMap: { [key: string]: string } = {
      white: '#ffffff',
      black: '#000000',
      red: '#ff0000',
      green: '#008000',
      blue: '#0000ff',
      yellow: '#ffff00',
      cyan: '#00ffff',
      magenta: '#ff00ff',
      gray: '#808080',
      silver: '#c0c0c0',
      maroon: '#800000',
      olive: '#808000',
      navy: '#000080',
      purple: '#800080',
      teal: '#008080',
      lime: '#00ff00',
      aqua: '#00ffff',
      fuchsia: '#ff00ff',
      orange: '#ffa500',
      brown: '#a52a2a',
      pink: '#ffc0cb',
    };

    // 将颜色名称转换为对应的十六进制值
    if (colorMap[hexDowncase]) {
      hexDowncase = colorMap[hexDowncase];
    }

    // 如果已经是rgba格式，直接返回
    if (hexDowncase.startsWith('rgba')) {
      return hexDowncase;
    }

    // 提取透明度值（如果存在）
    let alpha = 1;

    if (hexDowncase.length === 9) {
      alpha = parseInt('0x' + hexDowncase.slice(7, 9), 16) / 255;
    }

    // 如果传入的opacity有值，则使用传入的opacity
    if (opacity !== undefined) {
      alpha = opacity;
    }

    return (
      'rgba(' +
      parseInt('0x' + hexDowncase.slice(1, 3), 16) +
      ',' +
      parseInt('0x' + hexDowncase.slice(3, 5), 16) +
      ',' +
      parseInt('0x' + hexDowncase.slice(5, 7), 16) +
      ',' +
      alpha +
      ')'
    );
  },

  /** rgba颜色转为16进制颜色 */
  rgbaToHex(rgba: string): string {
    const parts = rgba.toLocaleLowerCase().slice(5, -1).split(',');
    const r = parseInt(parts[0].trim(), 10).toString(16).padStart(2, '0');
    const g = parseInt(parts[1].trim(), 10).toString(16).padStart(2, '0');
    const b = parseInt(parts[2].trim(), 10).toString(16).padStart(2, '0');
    let a: string | number = 1;

    if (parts.length === 4) {
      a = parseFloat(parts[3].trim());

      if (a < 1) {
        a = Math.round(a * 255)
          .toString(16)
          .padStart(2, '0');
      } else {
        a = '';
      }
    }

    return `#${r}${g}${b}${a}`;
  },

  toRgbaArray(rgba: string): number[] {
    return (rgba.startsWith('#') ? this.hexToRgba(rgba) : rgba).slice(5, -1).split(',').map(Number);
  },

  mixColor(color1: string, color2: string, weight = 0.5): string {
    const rgba1 = this.toRgbaArray(color1);
    const rgba2 = this.toRgbaArray(color2);
    const w = Math.max(Math.min(weight, 1), 0);
    const r = Math.round(rgba1[0] * w + rgba2[0] * (1 - w));
    const g = Math.round(rgba1[1] * w + rgba2[1] * (1 - w));
    const b = Math.round(rgba1[2] * w + rgba2[2] * (1 - w));
    const a = rgba1[3] * w + rgba2[3] * (1 - w);
    return `rgba(${r},${g},${b},${a})`;
  },
};

export default colorUtil;
