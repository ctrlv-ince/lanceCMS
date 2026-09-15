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
    <span class="summary-tile-label">{{ item().label }}</span>
    <strong>{{ item().value }}</strong><p>{{ item().description }}</p>
    @if (animated()) {<span class="mini-circuit" aria-hidden="true"><i></i><i></i><i></i></span>}
  </article>`,
})
export class SummaryCardComponent { item = input.required<SummaryItem>(); animated = input(false); }

@Component({selector: 'app-instruction-card', standalone: true,
  template: `<article class="instruction-tile"><span class="instruction-bits">{{ bits() }} <i></i></span>
    <strong>{{ code() }}</strong><p>{{ description() }}</p><span class="instruction-foot">OPCODE / MODULE</span></article>`,
})
export class InstructionCardComponent { code = input(''); bits = input(''); description = input(''); }

@Component({selector: 'app-architecture-block', standalone: true,
  template: `<button class="architecture-block" [class.selected]="selected()" [class.running]="running()"
    [attr.aria-pressed]="selected()" aria-describedby="architecture-detail"
    (click)="activate.emit(node().id)" (mouseenter)="activate.emit(node().id)" (focus)="activate.emit(node().id)">
    <span class="block-top"><span>{{ node().kind }}</span><i></i></span>
    <strong>{{ node().label }}</strong><span class="block-name">{{ node().name }}</span>
    <span class="block-description">{{ node().description }}</span>
    <span class="block-connection">{{ node().connection }}</span>
  </button>`,
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
        <button [class.active]="selected() === i" [attr.aria-pressed]="selected() === i" (click)="choose(i, detail)">{{ era.year }}</button>
      }
    </div>
    <div #detail tabindex="-1" class="era-feature" aria-live="polite">
      <app-cpu3d [label]="current().chip" [cores]="current().cores" />
      <div><span class="section-kicker">{{ current().year }} / {{ current().bits }}</span><h3>{{ current().label }}</h3>
        <p>{{ current().description }}</p><div class="era-milestone"><span>THE SHIFT</span>{{ current().milestone }}</div>
        <div class="era-controls"><button class="topic-button ghost" [disabled]="selected() === 0" (click)="selected.set(selected() - 1)">← Earlier</button>
          <span>{{ selected() + 1 }} / {{ eras.length }}</span><button class="topic-button ghost" [disabled]="selected() === eras.length - 1" (click)="selected.set(selected() + 1)">Later →</button></div>
      </div>
    </div>
    <div class="evolution-track">
      @for (era of eras; track era.year; let i = $index) {
        <button appReveal class="evolution-stop" [class.active]="selected() === i" [attr.aria-pressed]="selected() === i" (click)="choose(i, detail)">
          <span class="evolution-year">{{ era.year }}</span><span class="evolution-chip" [class.chip-expanded]="i > 2">
            @for (core of coreIds(era.cores); track core) {<i></i>}
          </span><strong>{{ era.bits }}</strong><span>{{ era.label }}</span>
        </button>
      }
    </div><p class="diagram-note">These eras show broad adoption, not invention dates. Technologies overlap and evolve at different rates.</p>`,
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
