import { Component, computed, input, output, signal } from '@angular/core';
import { ArchitectureNode, ERAS, SummaryItem } from './topic-data';
import { RevealDirective, TiltDirective } from './visual-behavior.directive';

@Component({selector: 'app-cpu3d', standalone: true, imports: [TiltDirective],
  template: `
    <div class="cpu-stage" appTilt aria-hidden="true">
      <div class="cpu-orbit orbit-one"></div><div class="cpu-orbit orbit-two"></div>
      <span class="cpu-coordinate">{{ cores() > 1 ? 'PARALLEL / ENGINE' : 'COMPUTE / ENGINE' }}</span>
      <div class="cpu-float"><div class="cpu-board" [class.processor-advanced]="advanced()">
        <div class="board-traces"></div>
        <span class="cpu-pins pins-top"></span><span class="cpu-pins pins-bottom"></span>
        <span class="cpu-pins pins-left"></span><span class="cpu-pins pins-right"></span>
        @if (advanced()) {<span class="processor-extension extension-left"></span><span class="processor-extension extension-right"></span>}
        <div class="cpu-package"><span class="cpu-serial">CE / {{ cores() > 1 ? 'MULTI' : 'COMPUTE' }}</span>
          <div class="cpu-die" [class.multi-core]="cores() > 1">
            @for (core of coreIds(); track core) { <span class="die-core"><i></i>@if (cores() > 1) {<small>{{ core + 1 }}</small>}</span> }
          </div>
          <strong>{{ label() }}</strong><span class="cpu-serial">INSTRUCTION → POSSIBILITY</span>
        </div>
      </div></div>
      <span class="cpu-status"><i></i> SYSTEM IN FOCUS</span>
    </div>`,
})
export class Cpu3dComponent {
  label = input('CPU');
  cores = input(1);
  advanced = input(false);
  coreIds = computed(() => Array.from({length: this.cores()}, (_, i) => i));
}

@Component({selector: 'app-summary-card', standalone: true,
  template: `<article class="summary-tile" [class.capability-tile]="animated()">
    <span class="summary-tile-label text-base font-bold tracking-wider text-sky-400">{{ item().label }}</span>
    <strong class="text-3xl sm:text-4xl font-bold my-3 block text-white">{{ item().value }}</strong>
    <p class="text-xl sm:text-2xl leading-relaxed text-slate-200 mt-3 font-normal">{{ item().description }}</p>
    @if (animated()) {<span class="mini-circuit" aria-hidden="true"><i></i><i></i><i></i></span>}
  </article>`,
  styles: [`
    :host { display: block; min-width: 0; }
    .summary-tile { height: 100%; position: relative; overflow: hidden; padding: 28px 24px; border-radius: 16px; background: #0f172a; border: 1px solid var(--exhibit-line, #243047); }
    .summary-tile-label { display: block; color: #93c5fd !important; font-size: 16px !important; font-weight: 700 !important; letter-spacing: .08em; text-transform: uppercase; }
    .summary-tile strong { display: block; margin-top: 12px; color: #ffffff !important; font-size: 30px !important; font-weight: 750 !important; letter-spacing: -.025em; overflow-wrap: anywhere; line-height: 1.25; }
    .capability-tile strong { color: var(--accent, #38d9f5) !important; font-size: 28px !important; font-weight: 750 !important; }
    .summary-tile p { font-size: 20px !important; line-height: 1.8 !important; margin-top: 14px; color: #e2e8f0 !important; }
  `],
})
export class SummaryCardComponent { item = input.required<SummaryItem>(); animated = input(false); }

@Component({selector: 'app-instruction-card', standalone: true,
  template: `<article class="instruction-tile">
    <span class="instruction-bits text-base font-bold tracking-widest">{{ bits() }} <i></i></span>
    <strong class="text-3xl sm:text-4xl font-bold my-3 block text-accent">{{ code() }}</strong>
    <p class="text-xl leading-relaxed text-slate-200">{{ description() }}</p>
    <span class="instruction-foot text-sm font-semibold tracking-wider">OPCODE / MODULE</span>
  </article>`,
  styles: [`
    :host { display: block; min-width: 0; }
    .instruction-bits { font-size: 15px; font-weight: 700; }
    .instruction-tile strong { font-size: 34px !important; font-weight: 750; }
    .instruction-tile p { font-size: 18px !important; line-height: 1.8; color: #e2e8f0; }
    .instruction-foot { font-size: 14px; font-weight: 600; }
  `],
})
export class InstructionCardComponent { code = input(''); bits = input(''); description = input(''); }

@Component({selector: 'app-architecture-block', standalone: true,
  template: `<button class="architecture-block" [class.selected]="selected()" [class.running]="running()"
    [attr.aria-pressed]="selected()" aria-describedby="architecture-detail"
    (click)="activate.emit(node().id)" (mouseenter)="activate.emit(node().id)" (focus)="activate.emit(node().id)">
    <span class="block-top text-sm font-bold tracking-wider"><span>{{ node().kind }}</span><i></i></span>
    <strong class="text-2xl sm:text-3xl font-bold my-1 block text-accent">{{ node().label }}</strong>
    <span class="block-name text-lg font-bold text-white">{{ node().name }}</span>
    <span class="block-description text-base text-slate-200 leading-normal">{{ node().description }}</span>
    <span class="block-connection text-sm text-slate-300 font-mono">{{ node().connection }}</span>
  </button>`,
  styles: [`
    :host { display: block; height: 100%; }
    .block-top { font-size: 13px; font-weight: 700; }
    .architecture-block strong { font-size: 28px !important; font-weight: 750; }
    .block-name { font-size: 17px !important; font-weight: 700; }
    .block-description { font-size: 16px !important; line-height: 1.7; color: #cbd5e1; }
    .block-connection { font-size: 13px; }
  `],
})
export class ArchitectureBlockComponent {
  node = input.required<ArchitectureNode>(); selected = input(false); running = input(false);
  activate = output<string>();
}

@Component({selector: 'app-architecture-connection', standalone: true,
  host: {'[class.connection-highlight]': 'active()', '[class.local-link]': 'local()', 'aria-hidden': 'true'},
  template: `<span class="connection-line"><i></i></span>`,
})
export class ArchitectureConnectionComponent { active = input(false); local = input(false); }

@Component({selector: 'app-data-bus', standalone: true,
  host: {'[class.bus-active]': 'active()', 'aria-hidden': 'true'},
  template: `<div class="data-bus"><span>DATA BUS</span><i></i><i></i><i></i></div>`,
})
export class DataBusComponent { active = input(false); }

@Component({selector: 'app-architecture', standalone: true,
  imports: [ArchitectureBlockComponent, ArchitectureConnectionComponent, DataBusComponent],
  template: `
    <div class="architecture-layout">
      <div class="architecture-board">
        <app-data-bus [active]="activeIds().length > 0" />
        @for (node of nodes(); track node.id; let i = $index) {
          <div class="architecture-slot" [class.slot-right]="i % 2 === 1">
            <app-architecture-block [node]="node" [selected]="selectedId() === node.id"
              [running]="activeIds().includes(node.id)" (activate)="selectedId.set($event)" />
            <app-architecture-connection [active]="selectedId() === node.id || activeIds().includes(node.id)"
              [local]="node.kind === 'control' || node.kind === 'compute' || node.id === 'display' || node.id === 'memory'" />
          </div>
        }
      </div>
      <aside class="architecture-detail" id="architecture-detail">
        @if (selectedNode(); as n) {
          <span class="section-kicker">COMPONENT IN FOCUS</span><div class="detail-symbol">{{ n.label }}</div>
          <h3>{{ n.name }}</h3><p>{{ n.description }}</p><p>{{ n.detail }}</p>
          <span class="detail-route">{{ n.connection }}</span>
        }
        <div class="architecture-legend"><span><i></i>Bus transfer</span><span><i class="local"></i>Local / control connection</span></div>
        <p class="diagram-note">Simplified functional map. Labels describe the connections; dashed links represent local datapath or control signals, rather than direct bus transfers.</p>
      </aside>
    </div>`,
})
export class ArchitectureComponent {
  nodes = input.required<ArchitectureNode[]>(); activeIds = input<string[]>([]);
  selectedId = signal('pc');
  selectedNode = computed(() => this.nodes().find(n => n.id === this.selectedId()) || this.nodes()[0]);
}

@Component({selector: 'app-timeline', standalone: true, imports: [Cpu3dComponent, RevealDirective],
  template: `
    <div class="era-navigation" aria-label="Choose an era">
      @for (era of eras; track era.year; let i = $index) {
        <button class="text-base font-bold" [class.active]="selected() === i" [attr.aria-pressed]="selected() === i" (click)="choose(i, detail)">{{ era.year }}</button>
      }
    </div>
    <div #detail tabindex="-1" class="era-feature" aria-live="polite">
      <app-cpu3d [label]="current().chip" [cores]="current().cores" />
      <div>
        <span class="section-kicker text-base font-bold tracking-wider">{{ current().year }} / {{ current().bits }}</span>
        <h3 class="text-3xl font-bold mt-2">{{ current().label }}</h3>
        <p class="text-lg sm:text-xl leading-relaxed text-slate-200 mt-3">{{ current().description }}</p>
        <div class="era-milestone text-lg text-slate-100 font-medium"><span class="text-sm font-bold text-accent">THE SHIFT</span>{{ current().milestone }}</div>
        <div class="era-controls mt-6">
          <button class="topic-button ghost text-base" [disabled]="selected() === 0" (click)="selected.set(selected() - 1)">← Earlier</button>
          <span class="text-base font-bold">{{ selected() + 1 }} / {{ eras.length }}</span>
          <button class="topic-button ghost text-base" [disabled]="selected() === eras.length - 1" (click)="selected.set(selected() + 1)">Later →</button>
        </div>
      </div>
    </div>
    <div class="evolution-track">
      @for (era of eras; track era.year; let i = $index) {
        <button appReveal class="evolution-stop" [class.active]="selected() === i" [attr.aria-pressed]="selected() === i" (click)="choose(i, detail)">
          <span class="evolution-year text-base font-bold">{{ era.year }}</span><span class="evolution-chip" [class.chip-expanded]="i > 2">
            @for (core of coreIds(era.cores); track core) {<i></i>}
          </span><strong class="text-base font-bold">{{ era.bits }}</strong><span class="text-sm font-medium text-slate-300">{{ era.label }}</span>
        </button>
      }
    </div><p class="diagram-note text-base text-slate-400">These eras show broad adoption, not invention dates. Technologies overlap and evolve at different rates.</p>`,
})
export class TimelineComponent {
  eras = ERAS; selected = signal(0); current = computed(() => this.eras[this.selected()]);
  coreIds(cores: number) { return Array.from({length: cores}, (_, i) => i); }
  choose(index: number, detail: HTMLElement) {
    this.selected.set(index);
    detail.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest'});
    detail.focus({preventScroll: true});
  }
}
