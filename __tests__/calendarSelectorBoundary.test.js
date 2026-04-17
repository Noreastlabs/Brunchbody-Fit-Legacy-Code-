import * as selectorsBarrel from '../src/redux/selectors'
import {
  selectCalendarClearedThemeDays,
  selectCalendarCurrentTheme,
  selectCalendarMyThemes,
  selectCalendarRepeatedTheme,
  selectCalendarThemesWithFrequency,
  selectCalendarTodoTasks,
  selectCalendarUser,
} from '../src/redux/selectors/calendar'

describe('calendar selector boundary', () => {
  test('selectors return the mounted calendar screen read contract without cloning', () => {
    const user = {id: 'user-1', name: 'Lane'}
    const todoTasks = [{id: 'todo-1', name: 'Stretch'}]
    const themes = [{id: 'theme-1', name: 'Reset'}]
    const currentTheme = {id: 'theme-1', name: 'Reset'}
    const repeatedTheme = {id: 'repeat-1', frequency: 'Weekly'}
    const themesWithFrequency = {'2026-04-16': {theme: currentTheme}}
    const clearedThemeDays = {Friday: 10}
    const state = {
      auth: {user},
      todo: {todoTasks},
      calendar: {
        themes,
        currentTheme,
        repeatedTheme,
        themesWithFrequency,
        clearedThemeDays,
      },
    }

    expect(selectCalendarUser(state)).toBe(user)
    expect(selectCalendarTodoTasks(state)).toBe(todoTasks)
    expect(selectCalendarMyThemes(state)).toBe(themes)
    expect(selectCalendarCurrentTheme(state)).toBe(currentTheme)
    expect(selectCalendarRepeatedTheme(state)).toBe(repeatedTheme)
    expect(selectCalendarThemesWithFrequency(state)).toBe(themesWithFrequency)
    expect(selectCalendarClearedThemeDays(state)).toBe(clearedThemeDays)
  })

  test('selectors preserve reducer-aligned stable fallbacks when slices or fields are missing', () => {
    const emptyRootState = {}
    const missingFieldState = {
      auth: {},
      todo: {},
      calendar: {},
    }

    expect(selectCalendarUser(emptyRootState)).toEqual({})
    expect(selectCalendarUser(emptyRootState)).toBe(selectCalendarUser({}))
    expect(selectCalendarUser(missingFieldState)).toBe(
      selectCalendarUser(emptyRootState),
    )

    expect(selectCalendarTodoTasks(emptyRootState)).toEqual([])
    expect(selectCalendarTodoTasks(emptyRootState)).toBe(
      selectCalendarTodoTasks({}),
    )
    expect(selectCalendarTodoTasks(missingFieldState)).toBe(
      selectCalendarTodoTasks(emptyRootState),
    )

    expect(selectCalendarMyThemes(emptyRootState)).toEqual([])
    expect(selectCalendarMyThemes(emptyRootState)).toBe(
      selectCalendarMyThemes({}),
    )

    expect(selectCalendarCurrentTheme(emptyRootState)).toEqual({})
    expect(selectCalendarCurrentTheme(emptyRootState)).toBe(
      selectCalendarCurrentTheme({}),
    )

    expect(selectCalendarRepeatedTheme(emptyRootState)).toEqual({})
    expect(selectCalendarRepeatedTheme(emptyRootState)).toBe(
      selectCalendarRepeatedTheme({}),
    )

    expect(selectCalendarThemesWithFrequency(emptyRootState)).toEqual({})
    expect(selectCalendarThemesWithFrequency(emptyRootState)).toBe(
      selectCalendarThemesWithFrequency({}),
    )

    expect(selectCalendarClearedThemeDays(emptyRootState)).toEqual({})
    expect(selectCalendarClearedThemeDays(emptyRootState)).toBe(
      selectCalendarClearedThemeDays({}),
    )
  })

  test('calendar todo selector keeps the legacy ownership seam on state.todo.todoTasks', () => {
    const todoTasks = [{id: 'todo-1', name: 'Hydrate'}]
    const state = {
      todo: {todoTasks},
      calendar: {
        todoTasks: [{id: 'calendar-task', name: 'Wrong seam'}],
      },
    }

    expect(selectCalendarTodoTasks(state)).toBe(todoTasks)
  })

  test('local selectors barrel exports the calendar selectors consumed by Calendar.js', () => {
    expect(selectorsBarrel.selectCalendarUser).toBe(selectCalendarUser)
    expect(selectorsBarrel.selectCalendarTodoTasks).toBe(
      selectCalendarTodoTasks,
    )
    expect(selectorsBarrel.selectCalendarMyThemes).toBe(
      selectCalendarMyThemes,
    )
    expect(selectorsBarrel.selectCalendarCurrentTheme).toBe(
      selectCalendarCurrentTheme,
    )
    expect(selectorsBarrel.selectCalendarRepeatedTheme).toBe(
      selectCalendarRepeatedTheme,
    )
    expect(selectorsBarrel.selectCalendarThemesWithFrequency).toBe(
      selectCalendarThemesWithFrequency,
    )
    expect(selectorsBarrel.selectCalendarClearedThemeDays).toBe(
      selectCalendarClearedThemeDays,
    )
  })
})
