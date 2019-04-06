# `useHover`

> This hook it's used to know if a component is on hover.

## Usage

```javascript
import {useHover} from '@react-hooks-utils/use-hover'

export default function Foo() {
  const {isHovered, eventBinders} = useHover()
  const style = {
    backgroundColor: isHovered ? 'red': 'white'
  }
  return (
      <p {...eventBinders} style={style}>
        Show some message
      </p>
  )
}
```
