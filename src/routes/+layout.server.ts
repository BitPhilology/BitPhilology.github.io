import { getSheets } from '$lib/server/content';

// Every page needs the posts of each category for the dock's page sheet.
export const load = () => ({ sheets: getSheets() });
