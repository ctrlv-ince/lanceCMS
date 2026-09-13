import catalog from '../../content/presentations.json';
export type Presentation = (typeof catalog.presentations)[number];
export const presentations = catalog.presentations;
export const folderUrl = catalog.folderUrl;
export function presentationUrl(presentation: Presentation, preview = false) {
	return (
		'https://drive.google.com/file/d/' +
		encodeURIComponent(presentation.driveId) +
		(preview ? '/preview' : '/view')
	);
}
