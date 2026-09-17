<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import Icon from './Icon.svelte';
	import type { Presentation } from './presentations';
	let { course }: { course: Presentation } = $props();
</script>

<a
	class="learning-card glass presentation-card"
	href={resolve('/courses/[slug]', { slug: course.slug })}
	style="--course-color:{course.color}"
>
	<div class="course-art presentation-art">
		<img
			class="presentation-thumbnail"
			src={asset(course.thumbnail)}
			alt={course.thumbnailAlt}
			loading="lazy"
			decoding="async"
		/>
		<div class="thumbnail-shade" aria-hidden="true"></div>
		<span class="art-label" aria-hidden="true">RASPI 2 AND 3 / PRESENTATIONS</span>
		<span class="preview-play" aria-hidden="true">?</span><span
			class="art-number"
			aria-hidden="true">MICROSOFT POWERPOINT ? PPTX</span
		>
	</div>
	<div class="course-card-content">
		<div class="card-meta">
			<span class="soft-badge">{course.category}</span><span class="file-type">PPTX</span>
		</div>
		<h3>{course.title}</h3>
		<p>View the original PowerPoint presentation from the shared course folder.</p>
		<div class="card-bottom"><span>View presentation</span><Icon name="arrow" size={18} /></div>
	</div>
</a>

<style>
	.presentation-art {
		height: 240px;
		background: #050816;
		isolation: isolate;
	}
	.presentation-thumbnail {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: transform 0.45s ease;
	}
	.presentation-card:hover .presentation-thumbnail {
		transform: scale(1.035);
	}
	.thumbnail-shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, #05081690, transparent 23%, transparent 72%, #050816ad);
		pointer-events: none;
	}
	.art-label,
	.art-number {
		color: #d4daf0;
		text-shadow: 0 1px 5px #000;
		z-index: 1;
	}
	.preview-play {
		position: absolute;
		bottom: 19px;
		right: 22px;
		border: 1px solid #aaa0df66;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		font-size: 13px;
		color: white;
		background: #10182bd9;
		backdrop-filter: blur(8px);
	}
	.file-type {
		font: 13px monospace;
		color: #acb6cb;
		letter-spacing: 1px;
	}
	.course-card-content h3 {
		min-height: 0;
		overflow-wrap: anywhere;
	}
	.course-card-content > p {
		min-height: 0;
	}
	@media (max-width: 480px) {
		.presentation-art {
			height: 210px;
		}
	}
</style>
