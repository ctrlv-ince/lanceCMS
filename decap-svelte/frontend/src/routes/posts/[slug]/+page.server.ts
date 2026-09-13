import { pb } from '$lib/pocketbase.js';
import type { Post } from '$lib/pocketbase.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const result = await pb
			.collection('posts')
			.getFirstListItem<Post>(`slug = "${params.slug}" && status = "published"`);

		return { post: result };
	} catch {
		error(404, `Post "${params.slug}" not found`);
	}
};
