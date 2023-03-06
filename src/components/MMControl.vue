<script setup lang="ts">
import { XMindEmbedViewer } from 'xmind-embed-viewer'

import MMDropdownMenu from './MMDropdownMenu.vue'

const props = defineProps<{ viewer: XMindEmbedViewer }>()

const handleLoadFile = (filePath: string) => {
  fetch(filePath).then(async (res) => {
    props.viewer.load(await res.arrayBuffer())
  })
}
</script>

<template>
  <div class="control">
    <MMDropdownMenu @click="handleLoadFile" />
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
    &-icon {
      margin-left: 4px;
    }
  }
}
</style>
