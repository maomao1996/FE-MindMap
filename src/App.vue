<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XMindEmbedViewer } from 'xmind-embed-viewer'

import MMControl from './components/MMControl.vue'
import data from '../public/xmind.json'

const viewer = ref<XMindEmbedViewer>()

onMounted(async () => {
  const res = await fetch(data[0].path)
  const instance = new XMindEmbedViewer({
    el: '#mm-fe-mindmap',
    file: await res.arrayBuffer(),
    styles: {
      width: '100vw',
      height: '100vh'
    }
  })

  instance.addEventListener('map-ready', () => {
    // instance.setZoomScale(50)
    instance.setFitMap()
  })

  viewer.value = instance
})
</script>

<template>
  <h1 class="title">FE-MindMap</h1>
  <nav class="nav">
    <a href="https://fe-mm.com" target="_blank" rel="noreferrer">茂茂</a>
    <a href="https://github.com/maomao1996/FE-MindMap" target="_blank" rel="noreferrer">GitHub</a>
  </nav>
  <div id="mm-fe-mindmap"></div>
  <MMControl v-if="viewer?.load" :viewer="viewer" />
</template>
