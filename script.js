const activateBtn = document.querySelector('#activateBtn');
const themeBtn = document.querySelector('#themeBtn');
const commandForm = document.querySelector('#commandForm');
const commandInput = document.querySelector('#commandInput');
const responsePanel = document.querySelector('#responsePanel');
const systemStatus = document.querySelector('#systemStatus');
const energyMeter = document.querySelector('#energyMeter');
const energyValue = document.querySelector('#energyValue');
const taskList = document.querySelector('#taskList');
const addTaskBtn = document.querySelector('#addTaskBtn');
const quickActions = document.querySelectorAll('.chip');

const replies = [
  'Diagnostics complete. All interactive systems are performing within optimal parameters.',
  'I have prioritized your mission queue and highlighted the next best action.',
  'Room scan complete. No threats detected, but the coffee level appears critically low.',
  'Calendar optimized. I reserved focus time and moved distractions to standby mode.',
  'Command accepted. I am routing extra power to the productivity core.',
];

const tasks = [
  'Calibrate arc reactor',
  'Review mission brief',
  'Secure the workshop',
  'Prepare launch checklist',
  'Analyze sensor data',
];

function setResponse(message) {
  responsePanel.textContent = message;
}

function updateEnergy() {
  const energy = Math.floor(Math.random() * 31) + 65;
  energyMeter.style.width = `${energy}%`;
  energyValue.textContent = `${energy}%`;
}

function addTask(label = tasks[Math.floor(Math.random() * tasks.length)]) {
  const item = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const text = document.createElement('span');
  text.textContent = label;

  checkbox.addEventListener('change', () => {
    text.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    text.style.opacity = checkbox.checked ? '0.62' : '1';
  });

  item.append(checkbox, text);
  taskList.append(item);
}

function runCommand(command) {
  const normalized = command.trim();
  if (!normalized) {
    setResponse('Please enter a command so I can assist.');
    return;
  }

  systemStatus.textContent = 'Processing command';
  updateEnergy();
  setResponse(`Processing: "${normalized}"`);

  window.setTimeout(() => {
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setResponse(`${reply} You asked me to: ${normalized}.`);
    systemStatus.textContent = 'System online';
  }, 450);
}

activateBtn.addEventListener('click', () => {
  systemStatus.textContent = 'System online';
  setResponse('JARVIS online. Neural interface synchronized and ready for your next command.');
  updateEnergy();
});

themeBtn.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  themeBtn.setAttribute('aria-pressed', String(isLight));
  setResponse(isLight ? 'Light theme engaged.' : 'Dark theme restored.');
});

commandForm.addEventListener('submit', (event) => {
  event.preventDefault();
  runCommand(commandInput.value);
  commandInput.value = '';
});

quickActions.forEach((button) => {
  button.addEventListener('click', () => runCommand(button.dataset.command));
});

addTaskBtn.addEventListener('click', () => addTask());

['Initialize interface', 'Confirm power levels', 'Stand by for command'].forEach(addTask);
