declare const colorUtil: {
    /** 16进制颜色转为rgba颜色 */
    hexToRgba(hex: string, opacity?: number | undefined): string;
    /** rgba颜色转为16进制颜色 */
    rgbaToHex(rgba: string): string;
    toRgbaArray(rgba: string): number[];
    mixColor(color1: string, color2: string, weight?: number): string;
};
export default colorUtil;
