const LOCAL_REUSE_SCOPE = 'device-local-template';

export const mealPlanningReuseTemplates = Object.freeze([
  {
    id: 'balanced-meal-starter',
    name: 'Balanced meal starter',
    reuseScope: LOCAL_REUSE_SCOPE,
    items: Object.freeze([
      {name: 'Protein item', type: 'meal', amount: '1'},
      {name: 'Vegetable item', type: 'meal', amount: '1'},
      {name: 'Wholegrain or starch item', type: 'meal', amount: '1'},
    ]),
  },
  {
    id: 'repeatable-snack',
    name: 'Repeatable snack',
    reuseScope: LOCAL_REUSE_SCOPE,
    items: Object.freeze([
      {name: 'Snack item', type: 'meal', amount: '1'},
      {name: 'Optional add-on', type: 'meal', amount: '1'},
    ]),
  },
]);

export const supplementReuseTemplates = Object.freeze([
  {
    id: 'daily-supplement-stack',
    name: 'Daily supplement stack',
    reuseScope: LOCAL_REUSE_SCOPE,
    items: Object.freeze([
      {name: 'Supplement item', type: 'supplement', amount: '1', unit: 'g'},
    ]),
  },
]);

export const workoutRoutineTemplates = Object.freeze([
  {
    id: 'starter-routine',
    name: 'Starter routine',
    reuseScope: LOCAL_REUSE_SCOPE,
    tasks: Object.freeze([
      {name: 'Warm up', amount: '5', unit: 'Mn'},
      {name: 'Main movement', amount: '10', unit: 'Rp'},
      {name: 'Cool down', amount: '5', unit: 'Mn'},
    ]),
  },
  {
    id: 'walking-day',
    name: 'Walking day',
    reuseScope: LOCAL_REUSE_SCOPE,
    tasks: Object.freeze([
      {name: 'Walk', amount: '20', unit: 'Mn'},
      {name: 'Stretch', amount: '5', unit: 'Mn'},
    ]),
  },
]);

export const motivationMechanicsCopy = Object.freeze({
  freshStart:
    'Start with one small local entry today. Progress is built from repeatable actions.',
  completedToday:
    'Today is logged locally. Come back tomorrow to keep the pattern going.',
  activeStreak:
    'Your recent activity is visible on this device. Keep the streak realistic and sustainable.',
});

export const notificationUxCopy = Object.freeze({
  disabledBuildInfo:
    'Reminder time saved locally. Alarm notifications are disabled in this build.',
  localPreference:
    'Reminder toggles are local app preferences on this device.',
  timePickerHelp:
    'Choose a reminder time for your local preference. The current build does not schedule OS notifications.',
});

const normalizeText = value => String(value || '').trim();

const cloneTemplateItems = items =>
  (items || []).map(item => ({
    ...item,
  }));

export const createReusablePlanFromTemplate = ({
  template,
  name,
  scheduledFor = 'unscheduled',
} = {}) => {
  if (!template || !template.id) {
    throw new Error('[domainPlanning] template with id is required.');
  }

  return {
    sourceTemplateId: template.id,
    name: normalizeText(name) || template.name,
    reuseScope: LOCAL_REUSE_SCOPE,
    scheduledFor,
    items: cloneTemplateItems(template.items || template.tasks),
  };
};

export const buildMotivationMessage = ({
  completedToday = false,
  streakDays = 0,
} = {}) => {
  const numericStreak = Number(streakDays);

  if (completedToday) {
    return motivationMechanicsCopy.completedToday;
  }

  if (Number.isFinite(numericStreak) && numericStreak > 0) {
    return motivationMechanicsCopy.activeStreak;
  }

  return motivationMechanicsCopy.freshStart;
};

export const getNotificationStatusMessage = ({
  isEnabled = false,
  reminderName = 'Reminder',
} = {}) => {
  const name = normalizeText(reminderName) || 'Reminder';

  if (!isEnabled) {
    return `${name} is off. ${notificationUxCopy.localPreference}`;
  }

  return `${name} is on as a local preference. ${notificationUxCopy.timePickerHelp}`;
};
