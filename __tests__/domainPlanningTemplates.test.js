import {
  buildMotivationMessage,
  createReusablePlanFromTemplate,
  getNotificationStatusMessage,
  mealPlanningReuseTemplates,
  motivationMechanicsCopy,
  notificationUxCopy,
  supplementReuseTemplates,
  workoutRoutineTemplates,
} from '../src/resources';

describe('domain planning templates and habit copy', () => {
  test('meal and supplement templates create local reusable drafts', () => {
    const mealDraft = createReusablePlanFromTemplate({
      template: mealPlanningReuseTemplates[0],
      name: 'Monday lunch',
      scheduledFor: '2026-06-13',
    });
    const supplementDraft = createReusablePlanFromTemplate({
      template: supplementReuseTemplates[0],
    });

    expect(mealDraft).toMatchObject({
      sourceTemplateId: 'balanced-meal-starter',
      name: 'Monday lunch',
      reuseScope: 'device-local-template',
      scheduledFor: '2026-06-13',
    });
    expect(supplementDraft.reuseScope).toBe('device-local-template');
    expect(mealDraft.items).not.toBe(mealPlanningReuseTemplates[0].items);
    expect(mealDraft.items.length).toBeGreaterThan(1);
  });

  test('workout templates and motivation messages avoid remote or account claims', () => {
    const workoutDraft = createReusablePlanFromTemplate({
      template: workoutRoutineTemplates[0],
    });
    const freshStart = buildMotivationMessage();
    const completedToday = buildMotivationMessage({completedToday: true});
    const activeStreak = buildMotivationMessage({streakDays: 3});

    expect(workoutDraft.items.map(item => item.name)).toEqual([
      'Warm up',
      'Main movement',
      'Cool down',
    ]);
    [freshStart, completedToday, activeStreak].forEach(copy => {
      expect(copy).not.toMatch(/account|cloud|sync|medical|diagnos/i);
    });
    expect(activeStreak).toBe(motivationMechanicsCopy.activeStreak);
  });

  test('notification copy is truthful for disabled OS notifications', () => {
    expect(notificationUxCopy.disabledBuildInfo).toMatch(/saved locally/i);
    expect(notificationUxCopy.disabledBuildInfo).toMatch(/disabled/i);
    expect(getNotificationStatusMessage({reminderName: 'Check Weight'})).toMatch(
      /local app preferences/i,
    );
    expect(
      getNotificationStatusMessage({
        isEnabled: true,
        reminderName: 'Complete Journal',
      }),
    ).toMatch(/does not schedule OS notifications/i);
  });

  test('template creation requires a source template id', () => {
    expect(() => createReusablePlanFromTemplate({template: {}})).toThrow(
      /template with id/i,
    );
  });
});
