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

/** "2026-03-15" → "03.2026", as in the "Online since" pill of artifacts; a bare year stays as it is. */
export function monthYear(date: string): string {
	const [year, month] = date.split('-');
	return month ? `${month}.${year}` : year;
}

/** "2026-05-20" → "20 May 2026", as in the venue line of publications; a bare year stays as it is. */
export function writtenDate(date: string): string {
	const [year, month, day] = date.split('-').map(Number);
	if (!month || !day) return String(year);
	// UTC on both sides, so the day never shifts with the time zone of the build or the browser.
	return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
}

/** "2026-05-08" → "2026". */
export function yearOf(date: string): string {
	return date.slice(0, 4);
}
