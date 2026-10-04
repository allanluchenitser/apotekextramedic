import { useTresContext, useLoop } from '@tresjs/core'

export default function useTresLoopDebug() {
  const { renderer } = useTresContext();
  const { onBeforeRender } = useLoop();

  onBeforeRender(() => console.count('render loop'))
  renderer.onRender(() => console.count('actual render'))
}