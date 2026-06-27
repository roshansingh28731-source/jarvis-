const activateBtn = document.querySelector('#activateBtn');
const themeBtn = document.querySelector('#themeBtn');
const commandForm = document.querySelector('#commandForm');
const commandInput = document.querySelector('#commandInput');
const responsePanel = document.querySelector('#responsePanel');
const systemStatus = document.querySelector('#systemStatus');
const activeAgentBadge = document.querySelector('#activeAgentBadge');
const energyMeter = document.querySelector('#energyMeter');
const energyValue = document.querySelector('#energyValue');
const taskList = document.querySelector('#taskList');
const addTaskBtn = document.querySelector('#addTaskBtn');
const quickActions = document.querySelectorAll('.chip');
const agentCards = document.querySelectorAll('.agent-card');

const agents = {
  jarvis: {
    name: 'JARVIS',
    ready: 'JARVIS online. Neural interface synchronized and ready for your next command.',
    replies: [
      'I have prioritized your mission queue and highlighted the next best action.',
      'Calendar optimized. I reserved focus time and moved distractions to standby mode.',
      'Command accepted. I am routing extra power to the productivity core.',
    ],
  },
  friday: {
    name: 'FRIDAY',
    ready: 'FRIDAY online. Security sweep routines are armed and monitoring the perimeter.',
    replies: [
      'Diagnostics complete. All interactive systems are performing within optimal parameters.',
      'Room scan complete. No threats detected, but the coffee level appears critically low.',
      'Threat model updated. I recommend maintaining passive surveillance.',
    ],
  },
  edith: {
    name: 'EDITH',
    ready: 'EDITH online. Research channels are open and briefing generation is ready.',
    replies: [
      'Briefing compiled. The highest-confidence recommendation is now at the top of the stack.',
      'I compared available signals and found a strong path forward.',
      'Research complete. I can turn these notes into a clean action plan.',
    ],
  },
};

const tasks = [
  'Calibrate arc reactor',
  'Review mission brief',
  'Secure the workshop',
  'Prepare launch checklist',
  'Analyze sensor data',
  'Sync agent handoff notes',
];

let activeAgent = 'jarvis';

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

function selectAgent(agentKey) {
  activeAgent = agentKey;
  const agent = agents[activeAgent];

  agentCards.forEach((card) => {
    const isSelected = card.dataset.agent === activeAgent;
    card.classList.toggle('active', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
  });

  activeAgentBadge.textContent = `${agent.name} selected`;
  systemStatus.textContent = 'Agent ready';
  setResponse(`${agent.name} is standing by. Send a command or use a quick action.`);
}

function runCommand(command) {
  const normalized = command.trim();
  if (!normalized) {
    setResponse('Please enter a command so the selected agent can assist.');
    return;
  }

  const agent = agents[activeAgent];
  systemStatus.textContent = `${agent.name} processing command`;
  updateEnergy();
  setResponse(`${agent.name} processing: "${normalized}"`);

  window.setTimeout(() => {
    const reply = agent.replies[Math.floor(Math.random() * agent.replies.length)];
    setResponse(`${agent.name}: ${reply} You asked me to: ${normalized}.`);
    systemStatus.textContent = 'System online';
  }, 450);
}

activateBtn.addEventListener('click', () => {
  const agent = agents[activeAgent];
  systemStatus.textContent = 'System online';
  setResponse(agent.ready);
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

agentCards.forEach((card) => {
  card.addEventListener('click', () => selectAgent(card.dataset.agent));
});

addTaskBtn.addEventListener('click', () => addTask());

['Initialize interface', 'Confirm power levels', 'Stand by for command'].forEach(addTask);
