import type { ObjectDirective } from 'vue'

const loadingDirective: ObjectDirective<HTMLElement> = {
  mounted(el) {
    const targetElement = el as HTMLElement

    targetElement.style.position = 'relative'

    const loadingContainer = document.createElement('div')

    loadingContainer.className = 'v-app-loader'

    const spinnerCircleElement = document.createElement('div')

    spinnerCircleElement.className = 'spinner-circle'

    loadingContainer.appendChild(spinnerCircleElement)
    targetElement.appendChild(loadingContainer)
  },
  updated(el, binding) {
    const loadingElement = el.querySelector('.v-app-loader') as HTMLElement
    if (loadingElement) {
      if (binding.value)
        loadingElement.style.display = 'flex'

      else
        loadingElement.style.display = 'none'
    }
  },
}

export default loadingDirective
