import React, {useState, ReactElement, useRef, Fragment} from 'react'
import {useEvent} from '../src/useEvent'
import {cleanup, render, fireEvent} from 'react-testing-library'

function WindowComponent(): ReactElement {
  const [count, setCount] = useState(0)

  useEvent(
    'click',
    () => {
      setCount(count + 1)
    },
    true
  )

  return <div data-testid="count">{count}</div>
}

function ElementEventComponent(): ReactElement {
  const [shouldHideContent, toggleContent] = useState(false)
  const dimmerRef = useRef<HTMLDivElement>(null)

  useEvent(
    'click',
    () => {
      toggleContent(true)
    },
    true,
    dimmerRef.current
  )

  return (
    <Fragment>
      <div data-testid="dimmer" ref={dimmerRef}>
        {!shouldHideContent && <div>inner info</div>}
      </div>
    </Fragment>
  )
}

describe('useEvent', () => {
  afterEach(cleanup)

  it('should sum one to count when firing a click on document body', () => {
    const windowComponent = render(<WindowComponent />)
    expect(Number(windowComponent.getByTestId('count').innerHTML)).toBe(0)
    fireEvent.click(document.body)
    expect(Number(windowComponent.getByTestId('count').innerHTML)).toBe(1)
  })

  it('should sum one to count when firing a click on the button', () => {
    const elementComponent = render(<ElementEventComponent />)
    expect(elementComponent.getByTestId('dimmer').innerHTML).toBe('<div>inner info</div>')
    fireEvent.click(elementComponent.getByTestId('dimmer'))
    expect(elementComponent.getByTestId('dimmer').innerHTML).toBe('')
  })
})
