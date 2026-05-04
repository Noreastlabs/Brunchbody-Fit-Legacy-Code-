import moment from 'moment';
import {
  getBodyWeightKilograms,
  kilogramsToPounds,
} from '../../utils/bodyMeasurementUnits';

const CHART_DATA_LENGTH = 7;
const NUMERIC_TEXT_PATTERN = /^-?(?:\d+|\d*\.\d+)$/;

const toFiniteNumber = value => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  if (!NUMERIC_TEXT_PATTERN.test(trimmedValue)) {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const toSafeChartValue = value => {
  const parsedValue = toFiniteNumber(value);

  return parsedValue === null ? 0 : parsedValue;
};

const toSafePositiveChartValue = value => {
  const parsedValue = toFiniteNumber(value);

  return parsedValue !== null && parsedValue > 0 ? parsedValue : 0;
};

const roundChartValue = value => {
  const parsedValue = toFiniteNumber(value);

  return parsedValue === null ? 0 : Math.round(parsedValue * 100) / 100;
};

const getCreatedOnTime = entry => toSafeChartValue(entry?.createdOn);

const sortByCreatedOnDescending = (a, b) =>
  getCreatedOnTime(b) - getCreatedOnTime(a);

const fillChartData = (values, count) => {
  Array(CHART_DATA_LENGTH - count)
    .fill()
    .forEach(() => {
      values.push(0);
    });

  return values;
};

const getWeightLogCanonicalKilograms = weightLog =>
  getBodyWeightKilograms({
    weightKilograms: weightLog?.weightKilograms,
  });

const getPoundChartValueFromKilograms = canonicalKilograms => {
  const pounds = kilogramsToPounds(canonicalKilograms);

  return pounds === null ? 0 : roundChartValue(pounds);
};

const getLegacyPoundChartValue = weightLog =>
  toSafePositiveChartValue(weightLog?.weight);

const getWeightLogPoundChartValue = weightLog => {
  const canonicalKilograms = getWeightLogCanonicalKilograms(weightLog);

  if (canonicalKilograms !== null) {
    return getPoundChartValueFromKilograms(canonicalKilograms);
  }

  return getLegacyPoundChartValue(weightLog);
};

const getWeightLogPoundAggregateValue = weightLog =>
  getWeightLogPoundChartValue(weightLog);

const getOutlookChartValue = dailyEntry =>
  toSafeChartValue(dailyEntry?.feelingRate);

const getCalorieDifferentialChartValue = caloriesEntry =>
  toSafeChartValue(caloriesEntry?.caloriesDifferential);

const buildDailyData = entries => {
  const weightData = [];
  const outlookData = [];
  const calDiffData = [];

  [...entries]
    .sort(sortByCreatedOnDescending)
    .splice(0, CHART_DATA_LENGTH)
    .forEach(item => {
      weightData.push(getWeightLogPoundChartValue(item?.WeightLog));
      outlookData.push(getOutlookChartValue(item?.DailyEntry));
      calDiffData.push(getCalorieDifferentialChartValue(item?.CaloriesEntry));
    });

  if (entries.length < CHART_DATA_LENGTH) {
    fillChartData(weightData, entries.length);
    fillChartData(outlookData, entries.length);
    fillChartData(calDiffData, entries.length);
  }

  return {
    weightData,
    outlookData,
    calDiffData,
  };
};

const buildPeriodData = ({
  entries,
  currentKey,
  getPeriodKey,
  includeEntry,
  getValue,
  divisor,
}) => {
  let count = 0;
  let periodKey = currentKey;
  let sum = 0;
  const values = [];

  [...entries]
    .splice(0, CHART_DATA_LENGTH)
    .sort(sortByCreatedOnDescending)
    .filter(includeEntry)
    .forEach((item, index, self) => {
      const itemKey = getPeriodKey(item);

      if (periodKey !== itemKey) {
        count += 1;
        values.push(roundChartValue(sum / divisor));
        sum = 0;
        sum += toSafeChartValue(getValue(item));
        periodKey = itemKey;
      } else if (self.length - 1 === index) {
        count += 1;
        sum += toSafeChartValue(getValue(item));
        values.push(roundChartValue(sum / divisor));
        sum = 0;
      } else {
        sum += toSafeChartValue(getValue(item));
      }
    });

  return fillChartData(values, count).splice(0, CHART_DATA_LENGTH);
};

export const buildDashboardReadModel = (entries = [], now = new Date()) => {
  const sourceEntries = Array.isArray(entries) ? entries : [];
  const currentDate = new Date(now);
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  return {
    day: buildDailyData(sourceEntries),
    week: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item?.WeightLog),
        getValue: item => getWeightLogPoundAggregateValue(item.WeightLog),
        divisor: CHART_DATA_LENGTH,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item?.DailyEntry),
        getValue: item => getOutlookChartValue(item.DailyEntry),
        divisor: CHART_DATA_LENGTH,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item?.CaloriesEntry),
        getValue: item =>
          getCalorieDifferentialChartValue(item.CaloriesEntry),
        divisor: CHART_DATA_LENGTH,
      }),
    },
    month: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item?.WeightLog),
        getValue: item => getWeightLogPoundAggregateValue(item.WeightLog),
        divisor: daysInMonth,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item?.DailyEntry),
        getValue: item => getOutlookChartValue(item.DailyEntry),
        divisor: daysInMonth,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item?.CaloriesEntry),
        getValue: item =>
          getCalorieDifferentialChartValue(item.CaloriesEntry),
        divisor: daysInMonth,
      }),
    },
    year: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item?.WeightLog),
        getValue: item => getWeightLogPoundAggregateValue(item.WeightLog),
        divisor: 365.24,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item?.DailyEntry),
        getValue: item => getOutlookChartValue(item.DailyEntry),
        divisor: 365.24,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item?.CaloriesEntry),
        getValue: item =>
          getCalorieDifferentialChartValue(item.CaloriesEntry),
        divisor: 365.24,
      }),
    },
  };
};
