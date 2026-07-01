const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

const requiredIds = [
  'activateBtn',
  'themeBtn',
  'commandForm',
  'commandInput',
  'responsePanel',
  'systemStatus',
  'activeAgentBadge',
  'energyMeter',
  'energyValue',
  'taskList',
  'addTaskBtn',
];

requiredIds.forEach((id) => {
  assert.match(html, new RegExp(`id="${id}"`), `Expected #${id} to exist in index.html`);
});

assert.equal((html.match(/class="agent-card/g) || []).length, 3, 'Expected three selectable agents');
assert.equal((html.match(/type="button"/g) || []).length, 10, 'Expected non-submit controls to be explicit buttons');
assert.match(html, /aria-label="Selected agent console"/, 'Expected generic selected-agent console label');

function createElement(tagName = 'div') {
  const listeners = {};
  return {
    tagName,
    dataset: {},
    style: {},
    children: [],
    textContent: '',
    value: '',
    checked: false,
    type: '',
    classList: {
      values: new Set(),
      toggle(name, force) {
        if (force) this.values.add(name);
        else this.values.delete(name);
      },
    },
    attributes: {},
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    append(...nodes) {
      this.children.push(...nodes);
    },
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    dispatch(type, event = {}) {
      listeners[type]?.(event);
    },
  };
}

const elements = Object.fromEntries(requiredIds.map((id) => [`#${id}`, createElement()]));
elements['#commandInput'].value = 'Plan my day';
const agentCards = ['jarvis', 'friday', 'edith'].map((agent) => {
  const card = createElement('button');
  card.dataset.agent = agent;
  return card;
});
const chips = ['Run diagnostics', 'Plan my day', 'Scan the room', 'Create agent briefing'].map((command) => {
  const chip = createElement('button');
  chip.dataset.command = command;
  return chip;
});

const document = {
  documentElement: createElement('html'),
  querySelector(selector) {
    return elements[selector];
  },
  querySelectorAll(selector) {
    if (selector === '.agent-card') return agentCards;
    if (selector === '.chip') return chips;
    return [];
  },
  createElement,
};

vm.runInNewContext(script, {
  document,
  window: { setTimeout: (callback) => callback() },
  Math,
});

assert.equal(elements['#taskList'].children.length, 3, 'Expected default mission tasks to render');
agentCards[1].dispatch('click');
assert.equal(elements['#activeAgentBadge'].textContent, 'FRIDAY selected');
assert.equal(elements['#systemStatus'].textContent, 'Agent ready');

elements['#activateBtn'].dispatch('click');
assert.match(elements['#responsePanel'].textContent, /^FRIDAY online\./);

elements['#commandForm'].dispatch('submit', { preventDefault() {} });
assert.equal(elements['#commandInput'].value, '', 'Expected submitted command input to clear');
assert.match(elements['#responsePanel'].textContent, /^FRIDAY:/);

console.log('Smoke tests passed');
