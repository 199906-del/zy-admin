import type { Directive, DirectiveBinding} from 'vue'
import { checkPermission } from '@/utils/permission'

const toggleEl = (el: HTMLElement, permission?: string) => {
  if (!permission) return
  if (!checkPermission(permission)) {
    el.parentNode?.removeChild(el)
  }
}

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
   toggleEl(el, binding.value)
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
   toggleEl(el, binding.value)
  }
}

export { permissionDirective }