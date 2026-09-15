import '@angular/compiler';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import ts from 'typescript';
import { createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

// Run the real component and RxJS request lifecycle, without a separate mock implementation.
const output = new URL('./.angular/topic-check/', import.meta.url);
for (const file of ['api.service', 'topics/topic-data', 'topics/topic-learning-data', 'topics/topic-learning.component', 'topics/visual-behavior.directive', 'topics/visual-components', 'topics/topic-summary.component']) {
  const source = await readFile(new URL(`./src/app/${file}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, experimentalDecorators: true,
  }}).outputText.replace(/from '([.][.]?\/[^']+)'/g, "from '$1.mjs'");
  const path = new URL(`${file}.mjs`, output);
  await mkdir(new URL('.', path), {recursive: true});
  await writeFile(path, compiled);
}
const {ApiService} = await import(new URL('api.service.mjs', output));
const {TopicSummaryPageComponent} = await import(new URL('topics/topic-summary.component.mjs', output));
const {TopicLearningComponent} = await import(new URL('topics/topic-learning.component.mjs', output));
const {TOPIC_LEARNING} = await import(new URL('topics/topic-learning-data.mjs', output));
const route = new BehaviorSubject(convertToParamMap({slug: 'sap-1'}));
const requests = [];
let pageTitle;
const injector = createEnvironmentInjector([
  {provide: ActivatedRoute, useValue: {paramMap: route}},
  {provide: Title, useValue: {setTitle: value => {pageTitle = value;}}},
  {provide: ApiService, useValue: {course: slug => {
    const response = new Subject(); requests.push({slug, response}); return response;
  }}},
]);
try {
  const ui = runInInjectionContext(injector, () => new TopicSummaryPageComponent());
  assert.equal(ui.loading(), true);
  const stale = requests.at(-1);
  route.next(convertToParamMap({slug: 'sap-2'}));
  stale.response.next({slug: 'sap-1', body: 'Complete lesson must not appear in summary'});
  assert.equal(ui.available(), false, 'Stale SAP-1 response cannot reveal SAP-2');
  requests.at(-1).response.error(new HttpErrorResponse({status: 404}));
  assert.equal(ui.loading(), false);
  assert.equal(ui.available(), false, 'Unpublished / missing lessons stay unavailable');
  assert.match(ui.error(), /not been published/);
  ui.retry(); requests.at(-1).response.next({slug: 'sap-2'}); requests.at(-1).response.complete();
  assert.equal(ui.available(), true); assert.equal(ui.error(), '');
  assert.match(pageTitle, /SAP-2/);

  // Edge cases: the sign bit is not equivalent to a positive unsigned value.
  for (const [value, binary, signed, zero, sign] of [
    ['0', '00000000', 0, true, false], ['5', '00000101', 5, false, false],
    ['127', '01111111', 127, false, false], ['128', '10000000', -128, false, true],
    ['255', '11111111', -1, false, true],
  ]) {
    ui.setAccumulator(value);
    assert.equal(ui.bits(), binary); assert.equal(ui.signed(), signed);
    assert.equal(ui.zeroFlag(), zero); assert.equal(ui.signFlag(), sign);
  }
  ui.setAccumulator('0'); ui.decrement(); assert.equal(ui.accumulator(), 255, 'Decrement wraps at 8 bits');
  ui.setAccumulator('500'); assert.equal(ui.accumulator(), 255);
  ui.setAccumulator('bad'); assert.equal(ui.accumulator(), 255);

  route.next(convertToParamMap({slug: 'sap-1'}));
  assert.equal(ui.accumulator(), 0, 'Changing topic resets demos');
  requests.at(-1).response.next({slug: 'sap-1'}); requests.at(-1).response.complete();
  ui.previousStep(); assert.equal(ui.traceIndex(), 0);
  ui.nextStep(); assert.equal(ui.trace().phase, 'FETCH'); assert.equal(ui.trace().a, 0);
  ui.nextStep(); assert.equal(ui.trace().phase, 'DECODE');
  ui.nextStep(); assert.equal(ui.trace().a, 5); assert.equal(ui.trace().out, 0);
  for (let step = 0; step < 4; step++) ui.nextStep();
  assert.equal(ui.trace().a, 8); assert.equal(ui.trace().b, 3);
  assert.equal(ui.trace().out, 0, 'Addition does not change output before OUT');
  while (ui.traceIndex() < ui.traceLength - 1) ui.nextStep();
  assert.equal(ui.trace().label, 'Halted'); assert.equal(ui.trace().out, 8);
  ui.nextStep(); assert.equal(ui.traceIndex(), ui.traceLength - 1, 'Cannot step past HLT');
  ui.resetTrace(); assert.equal(ui.trace().out, 0);
  assert.equal(ui.memory[0].label, 'LDA E'); assert.equal(ui.memory[14].byte, '00000101');

  route.next(convertToParamMap({slug: 'microprocessor-history'}));
  requests.at(-1).response.error(new HttpErrorResponse({status: 503}));
  assert.equal(ui.available(), false); assert.match(ui.error(), /temporarily unavailable/);
  ui.retry(); requests.at(-1).response.next({slug: 'microprocessor-history'});
  assert.equal(ui.available(), true);
  const count = requests.length;
  route.next(convertToParamMap({slug: 'unknown'}));
  assert.equal(requests.length, count, 'Unknown summary does not request an arbitrary lesson');
  assert.equal(ui.available(), false); assert.equal(ui.loading(), false);
  const study = new TopicLearningComponent();
  const event = {preventDefault() {}};
  for (const guide of Object.values(TOPIC_LEARNING)) {
    study.guide = guide; study.ngOnChanges();
    assert.equal(study.complete(), false, 'A new topic requires fresh quiz answers');
    study.check(event); assert.equal(study.checked(), false, 'Incomplete answers cannot be checked');
    for (const question of guide.questions) study.choose(question.id, (question.answer + 1) % question.options.length);
    study.check(event); assert.equal(study.checked(), true); assert.equal(study.score(), 0);
    for (const question of guide.questions) study.choose(question.id, question.answer);
    assert.equal(study.checked(), false, 'Editing an answer clears stale feedback');
    study.check(event); assert.equal(study.score(), guide.questions.length);
    study.reset(); assert.equal(study.complete(), false); assert.equal(study.checked(), false);
  }
  console.log('PASS: publication/retry/stale-route handling; original SAP-1 transfers and SAP-2 flags; all three learning quizzes reject incomplete answers, score responses, clear stale feedback, and reset on topic changes.');
} finally {injector.destroy();}
