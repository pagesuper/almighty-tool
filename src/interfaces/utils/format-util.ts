export interface IFormatUtil {
  showDatetime(value: Date, type: string, lang?: string): string;
  getTimeBetween(options: {
    startDate: string | Date;
    endDate: string | Date;
    type: string;
  }): number;
}
