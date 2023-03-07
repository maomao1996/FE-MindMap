<script setup lang="ts">
import { XMindEmbedViewer } from 'xmind-embed-viewer'

import MMDropdownMenu from './MMDropdownMenu.vue'

const props = defineProps<{ viewer: XMindEmbedViewer }>()

const selectFileFromLocal = async (accept: string) => {
  const fileSelector = document.createElement('input')
  fileSelector.style.display = 'none'
  document.body.appendChild(fileSelector)
  await new Promise<void>((resolve) => {
    fileSelector.setAttribute('type', 'file')
    fileSelector.setAttribute('accept', accept)
    fileSelector.addEventListener('change', () => {
      resolve()
    })
    fileSelector.click()
  }).finally(() => {
    document.body.removeChild(fileSelector)
  })
  if (!fileSelector.files || !fileSelector.files.length) {
    return
  }
  return fileSelector.files[0]
}

const handleLoadFile = (filePath: string) => {
  fetch(filePath).then(async (res) => {
    props.viewer.load(await res.arrayBuffer())
  })
}

const handleOpenLocalFile = async () => {
  const file = await selectFileFromLocal('.xmind')
  if (!file) return
  props.viewer.load(await file.arrayBuffer())
}
</script>

<template>
  <div class="control">
    <MMDropdownMenu @click="handleLoadFile" />
    <button class="btn" @click="handleOpenLocalFile">打开本地文件</button>
  </div>
</template>

<style lang="scss">
.control {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 14px;
  left: 14px;
  border-radius: 8px;
  padding: 6px 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  background: #fff;
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 4px;
    border: 0;
    padding: 4px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    & ~ .btn {
      margin-left: 12px;
    }
    &-icon {
      margin-left: 4px;
    }
  }
}
</style>
