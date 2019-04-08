# useEvent

This hook lets you register an event on `window` or a passed element when the component mounts on the DOM and unregister it when the component unmounts from the DOM with the same API as the `addEventListener` method

## Installation

Install with yarn:
```
yarn add @react-hook-utils/use-event
```
Install with npm:
```
npm install @react-hook-utils/use-event
```

## API

```javascript
import {useEvent} from '@react-hook-utils/use-event'

useEvent('click', () => {
    console.log('clicked')
})
```

- `event`: **(Required)** Event
- `callback`: **(Required)** Function
- `options`: Boolean | Event Options
- `element`: HTMLElement

## Usage

```javascript
import React, {useState} from 'react'
import {useEvent} from '@react-hook-utils/use-event'

function Example() {

    const [count, setCount] = useState(0)

    useEvent('click', () => {
        setCount(count + 1)
    })

    return (
        <div>{count}</div>
    )
}
```
