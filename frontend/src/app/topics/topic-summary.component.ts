import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { ArchitectureComponent, Cpu3dComponent, InstructionCardComponent, SummaryCardComponent, TimelineComponent } from './visual-components';
import { RevealDirective } from './visual-behavior.directive';
import { binaryByte, CAPABILITIES, findTopic, SAP1_INSTRUCTIONS, SAP1_STEPS, SAP2_GROUPS, signedByte, Topic, TOPICS } from './topic-data';
import { TOPIC_LEARNING } from './topic-learning-data';
import { TopicLearningComponent } from './topic-learning.component';

@Component({selector: 'app-topic-summary', standalone: true,
  imports: [RouterLink, Cpu3dComponent, ArchitectureComponent, SummaryCardComponent, InstructionCardComponent, TimelineComponent, RevealDirective, TopicLearningComponent],
  templateUrl: './topic-summary.component.html',
})
export class TopicSummaryPageComponent {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private retryRequests = new Subject<void>();
  topic = signal<Topic | undefined>(undefined);
  loading = signal(true); available = signal(false); error = signal('');
  topics = TOPICS; instructions = SAP1_INSTRUCTIONS; groups = SAP2_GROUPS; capabilities = CAPABILITIES;
  learningGuides = TOPIC_LEARNING;
  evolution = [
    {label: 'Smaller transistors', value: 'More on a chip', description: 'Denser integration makes room for more processing and storage resources.'},
    {label: 'Higher clock speeds', value: 'Faster cycles', description: 'Clock frequency grew over time, while heat and power constrain further increases.'},
    {label: 'More cores', value: 'Shared work', description: 'Independent instruction streams can run in parallel when software supports it.'},
    {label: 'Larger cache', value: 'Data nearby', description: 'Fast local memory reduces the need to wait for slower main memory.'},
    {label: 'Better efficiency', value: 'Work per watt', description: 'Architecture and power management aim to do useful work with less energy.'},
  ];
  traceIndex = signal(0); trace = computed(() => SAP1_STEPS[this.traceIndex()]);
  traceLength = SAP1_STEPS.length;
  accumulator = signal(0);
  bits = computed(() => binaryByte(this.accumulator()));
  signed = computed(() => signedByte(this.accumulator()));
  zeroFlag = computed(() => this.accumulator() === 0);
  signFlag = computed(() => this.accumulator() >= 128);
  modernPart = signal('core1');
  modernParts = [
    {id: 'core1', label: 'Core 1', description: 'An execution core runs its own instruction stream. Parallel tasks can run on different cores.'},
    {id: 'core2', label: 'Core 2', description: 'A second core can process independent work while other cores are busy.'},
    {id: 'core3', label: 'Core 3', description: 'Multiple cores help when software divides the workload into concurrent tasks.'},
    {id: 'core4', label: 'Core 4', description: 'More cores add parallel capacity; they do not automatically make every program faster.'},
    {id: 'cache', label: 'Cache', description: 'Small, fast memory keeps frequently used instructions and data near the execution cores.'},
    {id: 'registers', label: 'Registers', description: 'Tiny storage locations inside each core hold operands, addresses, and working results.'},
    {id: 'control', label: 'Control unit', description: 'Instruction control coordinates the work performed inside each core.'},
    {id: 'alu', label: 'ALU', description: 'Arithmetic and logic units inside each core operate on values and bit patterns.'},
  ];
  modernDetail = computed(() => this.modernParts.find(p => p.id === this.modernPart())!);
  memory = Array.from({length: 16}, (_, address) => ({
    address: address.toString(16).toUpperCase(),
    byte: binaryByte(({0: 14, 1: 31, 2: 224, 3: 240, 14: 5, 15: 3} as Record<number, number>)[address] || 0),
    label: ({0: 'LDA E', 1: 'ADD F', 2: 'OUT', 3: 'HLT', 14: 'Data: 5', 15: 'Data: 3'} as Record<number, string>)[address] || 'Unused',
  }));
  overview = [
    {label: 'Simple architecture', value: 'One clear path', description: 'A shared bus makes register transfers easy to follow.'},
    {label: '8-bit computer', value: 'A byte at a time', description: 'Registers and arithmetic work with eight data bits.'},
    {label: 'Educational computer', value: 'Learn by tracing', description: 'See how hardware turns a short program into a result.'},
  ];
  cycle = [
    {label: 'FETCH', description: 'Retrieve the instruction byte from memory.', code: '01'},
    {label: 'DECODE', description: 'Choose the control sequence for the opcode.', code: '02'},
    {label: 'EXECUTE', description: 'Perform the required transfers or operation.', code: '03'},
    {label: 'OUTPUT', description: 'An OUT instruction makes the result visible.', code: '04'},
  ];
  constructor() {
    this.route.paramMap.pipe(
      tap(params => {
        const topic = findTopic(params.get('slug') || '');
        this.topic.set(topic); this.traceIndex.set(0); this.accumulator.set(0); this.modernPart.set('core1');
        this.title.setTitle(topic ? `${topic.label} · Visual summary · Directus Learn` : 'Topic unavailable · Directus Learn');
      }),
      switchMap(() => this.retryRequests.pipe(
        startWith(undefined),
        tap(() => { this.loading.set(true); this.available.set(false); this.error.set(''); }),
        switchMap(() => {
          const topic = this.topic();
          if (!topic) { this.error.set('This visual summary does not exist.'); return of(false); }
          // Check the existing published-only endpoint. Never render the full lesson on a summary page.
          return this.api.course(topic.slug).pipe(
            map(course => course.slug === topic.slug),
            catchError((error: HttpErrorResponse) => {
              this.error.set(error.status === 404
                ? 'This lesson is unavailable or has not been published.'
                : 'The learning service is temporarily unavailable. Please try again.');
              return of(false);
            }),
          );
        }),
      )),
      takeUntilDestroyed(),
    ).subscribe(available => { this.available.set(available); this.loading.set(false); });
  }
  retry() { this.retryRequests.next(); }
  binary = binaryByte;
  nextStep() { this.traceIndex.update(i => Math.min(i + 1, SAP1_STEPS.length - 1)); }
  previousStep() { this.traceIndex.update(i => Math.max(i - 1, 0)); }
  resetTrace() { this.traceIndex.set(0); }
  setAccumulator(value: string) { const number = Number(value); if (Number.isFinite(number)) this.accumulator.set(Math.max(0, Math.min(255, Math.trunc(number)))); }
  decrement() { this.accumulator.update(value => (value - 1) & 255); }
  explore(target: HTMLElement) {
    target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    target.focus({preventScroll: true});
  }
}
