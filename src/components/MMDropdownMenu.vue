<script lang="ts" setup>
import { ref, Teleport } from 'vue'
import { useFloating, offset } from '@floating-ui/vue'

import data from '../../public/xmind.json'

const emit = defineEmits<{
  (e: 'click', filePath: string): void
}>()

const trigger = ref()
const tooltip = ref()
const open = ref(false)

const { update, x, y, strategy } = useFloating(trigger, tooltip, {
  placement: 'top-start',
  middleware: [offset({ mainAxis: 10, crossAxis: 0 })],
  open
})

const handleTrigger = () => {
  open.value = !open.value
  update()
}

const handleClick = (filePath: string) => {
  open.value = false
  emit('click', filePath)
}
</script>

<template>
  <button class="btn" ref="trigger" @click="handleTrigger">
    切换 Xmind
    <svg
      class="btn-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 10L8.05303 12.947C8.02374 12.9763 7.97626 12.9763 7.94697 12.947L5 10"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M11 6L8.05303 3.05303C8.02374 3.02374 7.97626 3.02374 7.94697 3.05303L5 6"
        stroke="currentcolor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  </button>
  <Teleport to="body">
    <div
      :style="{ position: strategy, top: `${y ?? 0}px`, left: `${x ?? 0}px` }"
      v-show="open"
      ref="tooltip"
    >
      <div class="dropdown-menu">
        <div v-for="item in data" class="dropdown-item" @click="handleClick(item.path)">
          {{ item.name }} [{{ item.updateTime }}]
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.dropdown-menu {
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 8px;
  max-height: 50vh;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #000;
  background: #fff;
}

.dropdown-item {
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
}
</style>
