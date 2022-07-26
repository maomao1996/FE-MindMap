import { join } from 'node:path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { orderBy } from 'lodash-es'

const MD_HEADER = `# FE-MindMap

前端知识图谱（用思维导图的方式总结个人所学知识）

`
const MD_FOOTER = `\n`

function getDirectoryInfo(basePath = '') {
  const result = []

  function finder(path) {
    const directory = fs.readdirSync(path)
    directory.forEach((name) => {
      const filePath = join(path, name)
      const fileStats = fs.statSync(filePath)
      if (fileStats.isFile() && name.endsWith('.xmind')) {
        result.push(
          execa('git', [
            'log',
            '--pretty=format:%ad',
            '--date=short',
            filePath
          ]).then((res) => {
            const time = res.stdout.split('\n')
            return {
              name: name.replace('.xmind', ''),
              path: filePath,
              updateTime: time.at(0),
              createdTime: time.at(-1)
            }
          })
        )
      }
    })
  }

  const path = join('./', basePath)
  if (fs.existsSync(path)) {
    finder(path)
  }

  return result
}

function generateList(list) {
  if (!list.length) {
    return ''
  }

  return orderBy(
    list.filter((item) => item.updateTime),
    ['updateTime'],
    ['desc']
  )
    .map(
      (item) =>
        `- [x] [${item.name}](/${encodeURI(item.path)})
  - 创建时间: ${item.createdTime}
  - 更新时间: ${item.updateTime}`
    )
    .join('\n')
}

try {
  // 组装 MD 头部
  let md = MD_HEADER

  // 组装列表数据
  const result = await Promise.all(getDirectoryInfo('xmind'))
  md += generateList(result)

  // 组装 MD 尾部
  md += MD_FOOTER

  // 写入 README.md 文件
  fs.writeFile('README.md', md, 'utf8')
    .then(() => {
      console.log('README.md 文件创建成功')
    })
    .catch(() => {
      console.log('README.md 文件创建失败')
    })
} catch (error) {
  console.log('catch error :>> ', error)
}
