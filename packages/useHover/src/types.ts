export interface IEventBinders {
  onMouseEnter: () => void,
  onMouseLeave: () => void,
}
export type HoverSetter = (hover: boolean) => void

export interface IUseHover {
  isHovered: boolean,
  eventBinders: IEventBinders,
  setIsHovered: HoverSetter,
}
