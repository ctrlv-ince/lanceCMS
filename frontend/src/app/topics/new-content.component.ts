import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ArchitectureComponent, Cpu3dComponent, InstructionCardComponent, SummaryCardComponent, TimelineComponent } from './visual-components';
import { RevealDirective } from './visual-behavior.directive';
import { SAP1_INSTRUCTIONS, SAP2_GROUPS, TOPICS } from './topic-data';

@Component({
  selector: 'app-new-content', standalone: true,
  imports: [RouterLink, ArchitectureComponent, Cpu3dComponent, InstructionCardComponent, SummaryCardComponent, TimelineComponent, RevealDirective],
  templateUrl: './new-content.component.html',
})
export class NewContentComponent {
  topics = TOPICS;
  selectedSlug = signal('microprocessor-history');
  selected = computed(() => this.topics.find(topic => topic.slug === this.selectedSlug())!);
  instructions = SAP1_INSTRUCTIONS;
  groups = SAP2_GROUPS;
  constructor() { inject(Title).setTitle('New Learning Content · Directus Learn'); }
  explore(target: HTMLElement) {
    target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    target.focus({preventScroll: true});
  }
}
