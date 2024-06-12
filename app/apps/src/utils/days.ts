import { format, endOfDay, formatISO } from 'date-fns';

export function formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function endOfToday(): string {
    const todayEnd = endOfDay(new Date());
    const todayEndISOString = formatISO(todayEnd, { representation: 'complete' });

    return todayEndISOString
}

export function startOfToday(): string {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const date = today.getDate()
    const todayStr = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`

    return todayStr
}