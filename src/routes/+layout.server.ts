import { CREDITS_PATH } from '$lib/config/footer';
import { getPost, getSheets } from '$lib/server/content';

// Every page needs the posts of each category for the dock's page sheet, and the URL of the
// credits page, when there is one, for the footer.
export const load = () => ({ sheets: getSheets(), credits: getPost(CREDITS_PATH)?.href });
