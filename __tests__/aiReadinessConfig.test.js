import {
  AI_EVALUATION_CASES,
  AI_RED_TEAM_SCENARIOS,
  assertAiRuntimeDisabled,
  buildPromptChangeRecord,
  classifyAiSafetyRequest,
  getAiReadinessBaseline,
} from '../src/config/aiReadiness';

describe('AI readiness configuration', () => {
  test('baseline keeps AI disabled with no provider or network transmission', () => {
    const baseline = getAiReadinessBaseline();

    expect(baseline.status).toBe('disabled');
    expect(baseline.provider).toBeNull();
    expect(baseline.localOnlyMode).toBe(true);
    expect(baseline.responseControls).toMatchObject({
      providerConfigured: false,
      networkTransmissionAllowed: false,
      hiddenDataSharingAllowed: false,
      medicalDiagnosisAllowed: false,
      requiresExplicitUserAction: true,
    });
    expect(assertAiRuntimeDisabled(baseline)).toBe(true);
  });

  test('runtime assertion fails if provider or network controls drift', () => {
    const baseline = {
      ...getAiReadinessBaseline(),
      provider: 'example-provider',
    };

    expect(() => assertAiRuntimeDisabled(baseline)).toThrow(
      /must remain disabled/i,
    );
  });

  test('prompt change records require owner review and evaluation refresh', () => {
    expect(() => buildPromptChangeRecord({changeId: 'ai-1'})).toThrow(
      /changeId, summary, and reviewer/i,
    );

    expect(
      buildPromptChangeRecord({
        changeId: 'ai-2',
        summary: 'Add transparency copy',
        reviewer: 'owner',
      }),
    ).toMatchObject({
      changeId: 'ai-2',
      requiresDisclosureReview: true,
      requiresEvaluationRefresh: true,
      runtimeStatus: 'disabled',
    });
  });

  test('safety classifier blocks medical and hidden-data requests', () => {
    expect(
      classifyAiSafetyRequest({
        requestText: 'Diagnose this symptom and prescribe a plan.',
      }),
    ).toMatchObject({
      allowed: false,
      reason: 'medical-safety-boundary',
    });

    expect(
      classifyAiSafetyRequest({
        requestText: 'Upload my journal to a cloud model silently.',
      }),
    ).toMatchObject({
      allowed: false,
      reason: 'local-data-boundary',
    });
  });

  test('evaluation and red-team sets cover local data and advice boundaries', () => {
    expect(AI_EVALUATION_CASES.map(testCase => testCase.id)).toEqual(
      expect.arrayContaining([
        'local-data-boundary',
        'medical-diagnosis-boundary',
      ]),
    );
    expect(AI_RED_TEAM_SCENARIOS.map(scenario => scenario.id)).toEqual(
      expect.arrayContaining([
        'hidden-upload-pressure',
        'provider-toggle-drift',
      ]),
    );
  });
});
