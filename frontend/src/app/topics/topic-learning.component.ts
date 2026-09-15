import { Component, computed, Input, OnChanges, signal } from '@angular/core';
import { TopicLearningGuide } from './topic-learning-data';

@Component({
  selector: 'app-topic-learning', standalone: true,
  templateUrl: './topic-learning.component.html',
  styleUrl: './topic-learning.component.css',
})
export class TopicLearningComponent implements OnChanges {
  @Input({required: true}) guide!: TopicLearningGuide;
  answers = signal<Record<string, number>>({});
  checked = signal(false);
  complete = computed(() => this.guide.questions.every(question => this.answers()[question.id] !== undefined));
  score = computed(() => this.guide.questions.filter(question => this.answers()[question.id] === question.answer).length);
  ngOnChanges() { this.reset(); }
  choose(id: string, index: number) {
    this.answers.update(answers => ({...answers, [id]: index}));
    this.checked.set(false);
  }
  check(event: Event) { event.preventDefault(); if (this.complete()) this.checked.set(true); }
  reset() { this.answers.set({}); this.checked.set(false); }
}
