// import cases from 'jest-in-case'
import {renderHook, cleanup, act} from 'react-hooks-testing-library'
import {useHover} from '../src/useHover'
describe('useHover', () => {
  let hover: any
  afterEach(cleanup)
  beforeEach(() => {
    hover = renderHook(() => useHover())
  })
  it('should set initialValues properly', () => {
    const {isHovered, eventBinders, setIsHovered} = hover.result.current
    expect(isHovered).toBe(false)
    expect(eventBinders).toHaveProperty('onMouseEnter')
    expect(typeof eventBinders.onMouseEnter).toBe('function')
    expect(eventBinders).toHaveProperty('onMouseLeave')
    expect(typeof eventBinders.onMouseLeave).toBe('function')
    expect(typeof setIsHovered).toBe('function')
  })
  it('should set isHovered value using setIsHovered', () => {
    const {isHovered, setIsHovered} = hover.result.current
    expect(isHovered).toBe(false)
    act(() => setIsHovered(true))
    const {isHovered: newHovered} = hover.result.current
    expect(newHovered).toBe(true)
  })
  it("should set isHovered in true if onMouseEnter it's called", () => {
    const {isHovered, eventBinders} = hover.result.current
    expect(isHovered).toBe(false)
    act(() => eventBinders.onMouseEnter())
    const {isHovered: newHovered} = hover.result.current
    expect(newHovered).toBe(true)
  })
  it("should set isHovered in false if onMouseLeave it's called", () => {
    const {setIsHovered} = hover.result.current
    act(() => setIsHovered(true))
    const {isHovered, eventBinders} = hover.result.current
    expect(isHovered).toBe(true)
    act(() => eventBinders.onMouseLeave())
    const {isHovered: newHovered} = hover.result.current
    expect(newHovered).toBe(false)
  })
})
