import fs from 'fs-extra'
import { execa } from 'execa'
import { globbySync } from 'globby'
import { orderBy } from 'lodash-es'

function getXmindList(directory = '') {
  return globbySync(`${directory}/**/*.(xmind)`, {
    objectMode: true
  }).map(({ name, path }) =>
    execa('git', ['log', '--pretty=format:%ad', '--date=short', path]).then((res) => {
      const time = res.stdout.split('\n')
      return {
        name: name.replace('.xmind', ''),
        path: `/${encodeURI(path)}`,
        updateTime: time.at(0),
        createdTime: time.at(-1)
      }
    })
  )
}

function generateList(list) {
  if (!list.length) {
    return ''
  }

  return
}

try {
  const result = await Promise.all(getXmindList('xmind'))

  // 写入 json 文件
  fs.writeFile(
    'public/xmind.json',
    JSON.stringify(
      orderBy(
        result.filter((item) => item.updateTime),
        ['updateTime'],
        ['desc']
      )
    ),
    'utf8'
  )
    .then(() => {
      console.log('public/xmind.json 文件创建成功')
    })
    .catch(() => {
      console.log('public/xmind.json 文件创建失败')
    })

  // 复制 xmind
  fs.copy('xmind', 'public/xmind')
    .then(() => {
      console.log('复制 xmind 文件成功')
    })
    .catch(() => {
      console.log('复制 xmind 文件失败')
    })
} catch (error) {
  console.log('catch error :>> ', error)
}
