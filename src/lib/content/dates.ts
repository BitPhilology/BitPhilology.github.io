// Date formats used on cards and pages. Dates in the front matter are `YYYY-MM-DD` or `YYYY`.

/** "2026-05-08" → "08.05.2026", as in the meta row of pages; a bare year stays as it is. */
export function longDate(date: string): string {
	const [year, month, day] = date.split('-');
	return month && day ? `${day}.${month}.${year}` : year;
}

/** "2026-05-08" → "08.05.26", as on event cards; a bare year stays as it is. */
export function shortDate(date: string): string {
	const [year, month, day] = date.split('-');
	return month && day ? `${day}.${month}.${year.slice(2)}` : year;
}

/** "2026-05-08" → "2026". */
export function yearOf(date: string): string {
	return date.slice(0, 4);
}
