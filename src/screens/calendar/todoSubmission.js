import moment from 'moment';

export const buildCalendarTodoSubmission = ({
  taskName,
  taskNotes,
  taskDay,
  year,
  month,
  date,
}) => {
  if (!taskName?.trim() || !taskDay?.trim()) {
    return null;
  }

  return {
    name: taskName,
    notes: taskNotes,
    day:
      taskDay === 'Someday'
        ? 'Someday'
        : moment(`${year}/${month}/${date}`, 'YYYY/MM/DD').format(),
  };
};
