import { composeHomeTiles } from '$lib/config/home';
import { getFillers, getPosts } from '$lib/server/content';

export const load = () => ({ tiles: composeHomeTiles(getPosts(), getFillers()) });
