import { error } from '@sveltejs/kit';
import { presentations, presentationUrl } from '$lib/presentations';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = ({ params }) => {
	const presentation = presentations.find((p) => p.slug === params.slug);
	if (!presentation) error(404, 'Presentation not found');
	return {
		presentation,
		previewUrl: presentationUrl(presentation, true),
		driveUrl: presentationUrl(presentation)
	};
};
