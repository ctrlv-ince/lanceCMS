<script lang="ts">
	import { learningGuides } from './learning-data';
	import type { SummaryTopic } from './topics';
	import './learning.css';
	let { topic }: { topic: SummaryTopic } = $props();
	let guide = $derived(learningGuides[topic.slug]);
	let answers = $state<Record<string, number>>({});
	let checked = $state(false);
	let complete = $derived(guide.questions.every((question) => answers[question.id] !== undefined));
	let score = $derived(
		guide.questions.filter((question) => answers[question.id] === question.answer).length
	);
</script>

<div class="ds-learning-guide">
	<nav class="ds-study-nav" aria-label="Learning guide sections">
		<a href="#ds-learning-plan">Learning plan</a><a href="#ds-detailed-lessons">Explanations</a><a
			href="#ds-worked-examples">Worked examples</a
		><a href="#ds-learning-resources">YouTube & references</a><a href="#ds-practice">Practice</a><a
			href="#ds-knowledge">Knowledge check</a
		>
	</nav>
	<section class="ds-section" id="ds-learning-plan">
		<header class="ds-heading">
			<span class="ds-eyebrow">LEARNING PLAN</span>
			<h2>Understand the topic, one step at a time.</h2>
		</header>
		<div class="ds-study-intro glass">
			<div>
				<h3>Before you start</h3>
				<p>{guide.prerequisites}</p>
				<h3>What this guide covers</h3>
				<p>{guide.scope}</p>
			</div>
			<div>
				<h3>By the end, you should be able to</h3>
				<ul>
					{#each guide.objectives as objective (objective)}<li>{objective}</li>{/each}
				</ul>
			</div>
		</div>
		<ol class="ds-roadmap">
			{#each guide.roadmap as step (step.title)}<li>
					<h3>{step.title}</h3>
					<p>{step.action}</p>
					<p class="ds-checkpoint"><strong>Checkpoint:</strong> {step.checkpoint}</p>
				</li>{/each}
		</ol>
	</section>
	<section class="ds-section" id="ds-detailed-lessons">
		<header class="ds-heading">
			<span class="ds-eyebrow">DETAILED EXPLANATIONS</span>
			<h2>Connect each term to a concrete behavior.</h2>
			<p>Read the explanation, then use the example to test the idea.</p>
		</header>
		<div class="ds-study-grid">
			{#each guide.lessons as lesson (lesson.title)}<article class="ds-study-panel glass">
					<h3>{lesson.title}</h3>
					<p>{lesson.explanation}</p>
					<div class="ds-example-note">
						<strong>Example</strong>
						<p>{lesson.example}</p>
					</div>
				</article>{/each}
		</div>
	</section>
	<section class="ds-section" id="ds-worked-examples">
		<header class="ds-heading">
			<span class="ds-eyebrow">WORKED EXAMPLES</span>
			<h2>Follow the reasoning, step by step.</h2>
		</header>
		{#each guide.examples as example (example.title)}<article
				class="ds-study-panel ds-worked-example glass"
			>
				<h3>{example.title}</h3>
				<p>{example.context}</p>
				<pre><code>{example.trace}</code></pre>
				<p>{example.explanation}</p>
			</article>{/each}
	</section>
	<section class="ds-section" id="ds-learning-resources">
		<header class="ds-heading">
			<span class="ds-eyebrow">WATCH & READ</span>
			<h2>YouTube lessons and reliable references.</h2>
			<p>
				Each link opens a new tab. Follow the study task, then compare what you learned with the
				original presentation.
			</p>
		</header>
		<div class="ds-study-grid">
			{#each guide.resources as resource (resource.url)}<article
					class="ds-study-panel ds-learning-resource glass"
				>
					<span class="ds-eyebrow"
						>{resource.kind === 'YouTube' ? '▶ YOUTUBE LESSON' : 'READING REFERENCE'}</span
					>
					<h3>
						<!-- External HTTPS learning resource, not a SvelteKit route. -->
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗</a>
					</h3>
					<span class="ds-resource-provider">{resource.provider}</span>
					<p>{resource.focus}</p>
					<div class="ds-example-note">
						<strong>Study task</strong>
						<p>{resource.task}</p>
					</div>
					<p class="ds-resource-context">{resource.context}</p>
					<!-- External HTTPS learning resource, not a SvelteKit route. -->
					<!-- eslint-disable svelte/no-navigation-without-resolve -->
					<a
						class="ds-button ds-secondary"
						href={resource.url}
						target="_blank"
						rel="noopener noreferrer"
						>{resource.kind === 'YouTube' ? 'Watch on YouTube' : 'Open reference'} ↗</a
					>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</article>{/each}
		</div>
	</section>
	<section class="ds-section">
		<header class="ds-heading">
			<span class="ds-eyebrow">COMMON MISUNDERSTANDINGS</span>
			<h2>Check the distinctions that matter.</h2>
		</header>
		<dl class="ds-misconceptions">
			{#each guide.mistakes as mistake (mistake.claim)}<div class="glass">
					<dt>{mistake.claim}</dt>
					<dd>{mistake.correction}</dd>
				</div>{/each}
		</dl>
	</section>
	<section class="ds-section" id="ds-practice">
		<header class="ds-heading">
			<span class="ds-eyebrow">PUT IT INTO PRACTICE</span>
			<h2>Explain it, predict it, then check it.</h2>
			<p>
				Try the task before revealing its expected result. These exercises do not require hardware.
			</p>
		</header>
		<div class="ds-study-grid">
			{#each guide.practice as exercise (exercise.title)}<article class="ds-study-panel glass">
					<h3>{exercise.title}</h3>
					<p>{exercise.task}</p>
					<details>
						<summary>Show expected result</summary>
						<p>{exercise.expected}</p>
					</details>
				</article>{/each}
		</div>
	</section>
	<section class="ds-section" id="ds-knowledge">
		<header class="ds-heading">
			<span class="ds-eyebrow">KNOWLEDGE CHECK</span>
			<h2>Can you explain the important parts?</h2>
			<p>
				Three questions with feedback. Answers stay on this page and do not change your course
				records.
			</p>
		</header>
		<form
			class="ds-study-panel ds-knowledge-form glass"
			onsubmit={(event) => {
				event.preventDefault();
				if (complete) checked = true;
			}}
		>
			{#each guide.questions as question (question.id)}<fieldset>
					<legend>{question.prompt}</legend>{#each question.options as option, index (option)}<label
							><input
								type="radio"
								name={topic.slug + '-' + question.id}
								checked={answers[question.id] === index}
								onchange={() => {
									answers = { ...answers, [question.id]: index };
									checked = false;
								}}
							/><span>{option}</span></label
						>{/each}{#if checked}<p class="ds-answer-feedback">
							<strong
								>{answers[question.id] === question.answer
									? 'Correct.'
									: 'Review this idea.'}</strong
							>
							{question.explanation}
						</p>{/if}
				</fieldset>{/each}
			<div class="ds-actions">
				<button type="submit" class="ds-button" disabled={!complete}>Check my understanding</button
				><button
					type="button"
					class="ds-button ds-secondary"
					onclick={() => {
						answers = {};
						checked = false;
					}}>Reset answers</button
				>
				<p class="ds-quiz-status" aria-live="polite">
					{checked
						? `${score} of ${guide.questions.length} correct. Review the explanations and try again.`
						: 'Choose an answer for every question before checking.'}
				</p>
			</div>
		</form>
	</section>
</div>
