export const BASE_URL = process.dev ?'https://localhost:7215/api':'https://sys.happytrip.vn/api'
/**
 * Formats a number into a currency string using the 'vi-VN' locale and the 'VND' currency.
 *
 * @param {number} amount - The number to format into currency.
 * @return {string} The formatted currency string.
 */
export function VND(amount: number): string {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    return formatter.format(amount);
}

export function convertUTCToLocal(utcString: string): string {
    const date = new Date(utcString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    //   @ts-ignore
    const formattedDate = date.toLocaleString('vi-VN', options);
    return formattedDate;
}