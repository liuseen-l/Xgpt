export function useToggle() {
  const root = document.querySelector('#root')
  const classList = Array.from(root?.classList || [])
  if (classList.includes('dark'))
    root?.classList.remove('dark')

  else
    root?.classList.add('dark')
}
