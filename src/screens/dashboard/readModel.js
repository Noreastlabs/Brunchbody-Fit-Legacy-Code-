import moment from 'moment';

const CHART_DATA_LENGTH = 7;

const roundChartValue = value => Math.round(value * 100) / 100;

const fillChartData = (values, count) => {
  Array(CHART_DATA_LENGTH - count)
    .fill()
    .forEach(() => {
      values.push(0);
    });

  return values;
};

const buildDailyData = entries => {
  const weightData = [];
  const outlookData = [];
  const calDiffData = [];

  [...entries]
    .sort((a, b) => b.createdOn - a.createdOn)
    .splice(0, CHART_DATA_LENGTH)
    .forEach(item => {
      weightData.push(item.WeightLog?.weight || '0');
      outlookData.push(item.DailyEntry?.feelingRate || '0');
      calDiffData.push(item.CaloriesEntry?.caloriesDifferential || '0');
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
    .sort((a, b) => b.createdOn - a.createdOn)
    .filter(includeEntry)
    .forEach((item, index, self) => {
      const itemKey = getPeriodKey(item);

      if (periodKey !== itemKey) {
        count += 1;
        values.push(roundChartValue(sum / divisor));
        sum = 0;
        sum += getValue(item);
        periodKey = itemKey;
      } else if (self.length - 1 === index) {
        count += 1;
        sum += getValue(item);
        values.push(roundChartValue(sum / divisor));
        sum = 0;
      } else {
        sum += getValue(item);
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

  // Preserve the current chart output exactly while moving ownership to dashboard.
  return {
    day: buildDailyData(sourceEntries),
    week: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item.WeightLog),
        getValue: item => parseFloat(item.WeightLog.weight, 10),
        divisor: CHART_DATA_LENGTH,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item.DailyEntry),
        getValue: item => parseInt(item.DailyEntry.feelingRate, 10),
        divisor: CHART_DATA_LENGTH,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('w'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('w'),
        includeEntry: item => Boolean(item.CaloriesEntry),
        getValue: item =>
          item.CaloriesEntry.caloriesDifferential
            ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
            : 0,
        divisor: CHART_DATA_LENGTH,
      }),
    },
    month: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item.WeightLog),
        getValue: item => parseFloat(item.WeightLog.weight, 10),
        divisor: daysInMonth,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item.DailyEntry),
        getValue: item => parseInt(item.DailyEntry.feelingRate, 10),
        divisor: daysInMonth,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('MMM'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('MMM'),
        includeEntry: item => Boolean(item.CaloriesEntry),
        getValue: item =>
          item.CaloriesEntry.caloriesDifferential
            ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
            : 0,
        divisor: daysInMonth,
      }),
    },
    year: {
      weightData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item.WeightLog),
        getValue: item => parseFloat(item.WeightLog.weight, 10),
        divisor: 365.24,
      }),
      outlookData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item.DailyEntry),
        getValue: item => parseInt(item.DailyEntry.feelingRate, 10),
        divisor: 365.24,
      }),
      calDiffData: buildPeriodData({
        entries: sourceEntries,
        currentKey: moment(currentDate).format('YYYY'),
        getPeriodKey: item => moment(item.createdOn, 'x').format('YYYY'),
        includeEntry: item => Boolean(item.CaloriesEntry),
        getValue: item =>
          item.CaloriesEntry.caloriesDifferential
            ? parseFloat(item.CaloriesEntry.caloriesDifferential, 10)
            : 0,
        divisor: 365.24,
      }),
    },
  };
};
