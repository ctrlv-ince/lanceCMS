import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Subject } from 'rxjs';

// Compile the real component for focused signal/state checks without a browser.
const output = new URL('./.angular/ui-check/', import.meta.url);
await mkdir(output, { recursive: true });
for (const file of ['api.service', 'icon.component', 'library.component']) {
  const source = await readFile(new URL(`./src/app/${file}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022,
    experimentalDecorators: true,
  } }).outputText.replace(/from '(.\/[^']+)'/g, "from '$1.mjs'");
  await writeFile(new URL(`${file}.mjs`, output), compiled);
}
const { ApiService } = await import(new URL('api.service.mjs', output));
const { LibraryComponent } = await import(new URL('library.component.mjs', output));
let request;
let calls = 0;
const injector = createEnvironmentInjector([{ provide: ApiService, useValue: {
  courses: () => { calls++; request = new Subject(); return request; },
} }]);
try {
  const ui = runInInjectionContext(injector, () => new LibraryComponent());
  assert.equal(ui.loading(), true);
  ui.load(); assert.equal(calls, 1, 'Concurrent refresh is ignored');
  const course = { id: 1, slug: 'example', title: 'CPU Design', description: 'Instruction basics', category: 'Architecture', level: 'Beginner', presentation_title: 'Lecture.pptx', date_created: null, date_updated: null };
  request.next([course, { ...course, id: 2, slug: 'other', title: 'Logic', category: 'Digital systems', presentation_title: null }]);
  request.complete();
  assert.equal(ui.loading(), false);
  assert.deepEqual(ui.categories(), ['Architecture', 'Digital systems']);
  assert.equal(ui.latestUpdate(), null, 'Missing dates are not fabricated');
  ui.query.set(' ARCHITECTURE '); assert.equal(ui.filtered().length, 1);
  ui.query.set('instruction'); assert.equal(ui.filtered().length, 2);
  ui.query.set('lecture.pptx'); assert.equal(ui.filtered()[0].id, 1);
  ui.category.set('Digital systems'); assert.equal(ui.filtered().length, 0);
  ui.reset(); assert.equal(ui.filtered().length, 2);
  ui.category.set('Digital systems'); assert.equal(ui.number(ui.filtered()[0]), '02', 'Number remains stable when filtered');
  ui.imageFailed(2); assert.equal(ui.failedImages().has(2), true);
  ui.load(); request.error(new Error('offline'));
  assert.equal(ui.loading(), false); assert.ok(ui.error());
  ui.load(); request.next([{ ...course, date_updated: '2026-08-01T10:00:00Z' }]); request.complete();
  assert.equal(ui.error(), ''); assert.equal(ui.category(), '');
  assert.equal(ui.latestUpdate(), Date.parse('2026-08-01T10:00:00Z'));
  assert.equal(ui.failedImages().size, 0);
  console.log('PASS: real library state — search, categories, reset, stable numbering, loading, retry, dates, image fallback.');
} finally { injector.destroy(); }
