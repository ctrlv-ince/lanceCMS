import catalog from '../../content/presentations.json';
export type Presentation = (typeof catalog.presentations)[number];
// Display the existing cards in course order without changing the CMS catalog or card data.
const displayOrder: Record<string, number> = {
	'raspi-2-advanced-sensor-applications': 0,
	'node-red-visual-iot-programming': 1
};
export const presentations = [...catalog.presentations].sort(
	(a, b) => (displayOrder[a.slug] ?? 2) - (displayOrder[b.slug] ?? 2)
);
export const folderUrl = catalog.folderUrl;
export function presentationUrl(presentation: Presentation, preview = false) {
	return (
		'https://drive.google.com/file/d/' +
		encodeURIComponent(presentation.driveId) +
		(preview ? '/preview' : '/view')
	);
}
