import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const script = await readFile(new URL('../public/contact.js', import.meta.url), 'utf8');
function setup({clipboard, legacy = false} = {}) {
  const state = {writes: [], selection: false, fields: 0};
  const status = {textContent: ''};
  const controls = {hidden: true, querySelector: () => status};
  const phone = {};
  const button = {
    dataset: {number: '+48570027154', success: 'Skopiowano', fallback: 'Przytrzymaj numer i wybierz Kopiuj.'},
    closest: () => controls,
    addEventListener: (_, handler) => { state.click = handler; },
    focus: () => {}
  };
  const context = {
    navigator: clipboard ? {clipboard: {writeText: async value => {state.writes.push(value); return clipboard(value);}}} : {},
    document: {
      querySelector: selector => selector === '.copy-number' ? button : phone,
      createElement: () => ({setAttribute() {}, style: {}, select() {}, setSelectionRange() {}, remove() {state.fields--;}}),
      body: {appendChild() {state.fields++;}},
      execCommand: () => legacy,
      createRange: () => ({selectNodeContents(value) {assert.equal(value, phone);}})
    },
    window: {getSelection: () => ({removeAllRanges() {}, addRange() {state.selection = true;}})}
  };
  vm.runInNewContext(script, context);
  return {state, status, controls};
}
test('standard clipboard copies only the exact public phone and confirms success', async () => {
  const x = setup({clipboard: () => Promise.resolve()});
  assert.equal(x.controls.hidden, false);
  await x.state.click();
  assert.deepEqual(x.state.writes, ['+48570027154']);
  assert.equal(x.status.textContent, 'Skopiowano');
  assert.equal(x.state.selection, false);
});
test('browser without Clipboard API uses native copy and removes its temporary field', async () => {
  const x = setup({legacy: true}); await x.state.click();
  assert.equal(x.status.textContent, 'Skopiowano'); assert.equal(x.state.fields, 0);
});
test('denied clipboard falls back to native copy without a download', async () => {
  const x = setup({clipboard: () => Promise.reject(new Error('Permission denied')), legacy: true});
  await x.state.click(); assert.equal(x.status.textContent, 'Skopiowano'); assert.equal(x.state.fields, 0);
});
test('blocked copy never reports false success and leaves a manual selection', async () => {
  const x = setup({clipboard: () => Promise.reject(new Error('Blocked'))});
  await x.state.click(); assert.equal(x.status.textContent, 'Przytrzymaj numer i wybierz Kopiuj.');
  assert.equal(x.state.selection, true); assert.equal(x.state.fields, 0);
});
