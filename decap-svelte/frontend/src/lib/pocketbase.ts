import PocketBase from 'pocketbase';

// PocketBase client — connects to local PocketBase backend
export const pb = new PocketBase('http://localhost:8090');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	body: string;
	tags: string[];
	thumbnail: string;
	status: 'draft' | 'published' | 'archived';
	date: string;
	created: string;
	updated: string;
}

export interface Page {
	id: string;
	title: string;
	slug: string;
	description: string;
	body: string;
	published: boolean;
	created: string;
	updated: string;
}

export interface Course {
	id: string;
	title: string;
	slug: string;
	instructor: string;
	cover: string;
	description: string;
	level: 'beginner' | 'intermediate' | 'advanced';
	published: boolean;
	body: string;
	created: string;
	updated: string;
}

// ─── Helper: Build image URL ──────────────────────────────────────────────────

/**
 * Get a PocketBase file URL for a record's file field.
 * @example getFileUrl('posts', record.id, record.thumbnail)
 */
export function getFileUrl(
	collection: string,
	recordId: string,
	filename: string,
	options?: { thumb?: string }
): string {
	if (!filename) return '';
	let url = `http://localhost:8090/api/files/${collection}/${recordId}/${filename}`;
	if (options?.thumb) url += `?thumb=${options.thumb}`;
	return url;
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

/** Returns true if the current user is authenticated */
export function isAuthenticated(): boolean {
	return pb.authStore.isValid;
}

/** Returns the currently authenticated user record */
export function currentUser() {
	return pb.authStore.record;
}

/** Log out the current user */
export function logout() {
	pb.authStore.clear();
}
