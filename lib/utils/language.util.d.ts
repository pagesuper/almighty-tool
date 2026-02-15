export interface DetectOption {
    only: string[];
    verbose: boolean;
    default?: string;
}
declare const languageUtil: {
    detectAll: (text: string, options?: Partial<DetectOption>) => {
        key: string;
        lang: string;
        accuracy: number;
    }[];
    getKeyByText: (text: string, options?: Partial<DetectOption>) => string | null;
};
export default languageUtil;
export { languageUtil };
