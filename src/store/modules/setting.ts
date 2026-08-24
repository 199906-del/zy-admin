import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingStore = defineStore('settingStore', () => {
  // state
  const menuCollapse = ref<boolean>(false) // 控制左边菜单是否折叠

  // actions
  function changeMenuCollapse() {
    menuCollapse.value = !menuCollapse.value
    console.log("menuCollapse", menuCollapse.value)
  }

  return {
    menuCollapse,
    changeMenuCollapse
  }
})