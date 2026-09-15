import { AfterViewInit, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

@Directive({selector: '[appTilt]', standalone: true, host: {
  '(pointermove)': 'tilt($event)', '(pointerleave)': 'reset()',
}})
export class TiltDirective {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  tilt(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = this.element.nativeElement.getBoundingClientRect();
    this.element.nativeElement.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 8}deg`);
    this.element.nativeElement.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 8}deg`);
  }
  reset() {
    this.element.nativeElement.style.removeProperty('--tilt-x');
    this.element.nativeElement.style.removeProperty('--tilt-y');
  }
}

@Directive({selector: '[appReveal]', standalone: true})
export class RevealDirective implements AfterViewInit {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  ngAfterViewInit() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const target = this.element.nativeElement;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        target.classList.add('reveal-enter');
        observer.disconnect();
      }
    }, {threshold: 0.08});
    observer.observe(target);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
