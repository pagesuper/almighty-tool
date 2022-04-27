export interface IFormatUtil {
  getTimeBetween(options: {
    startDate: string | Date;
    endDate: string | Date;
    type: string;
  }): number;
}
