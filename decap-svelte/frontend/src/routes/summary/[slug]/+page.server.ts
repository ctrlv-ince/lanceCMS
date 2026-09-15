import { error } from '@sveltejs/kit';
import { presentations } from '$lib/presentations';
import { findSummaryTopic } from '$lib/summaries/topics';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const topic = findSummaryTopic(params.slug);
	if (!topic) error(404, 'Visual summary not found');
	const presentation = presentations.find((item) => item.slug === topic.presentationSlug);
	if (!presentation) error(404, 'Original presentation unavailable');
	return { topic, presentation };
};
