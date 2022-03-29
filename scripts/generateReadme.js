import { join } from 'node:path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { sortBy } from 'lodash-es'

const MD_HEADER = `# FE-MindMap

前端知识图谱（用思维导图的方式总结个人所学知识）

`
const MD_FOOTER = `\n`

function getDirectoryInfo() {
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
            -1,
            name
          ]).then((res) => {
            return {
              name: name.replace('.xmind', ''),
              path: filePath,
              updateTime: res.stdout
            }
          })
        )
      }
    })
  }

  const path = join('./')
  if (fs.existsSync(path)) {
    finder(path)
  }

  return result
}

function generateList(list) {
  if (!list.length) {
    return ''
  }
  return sortBy(
    list.filter((item) => item.updateTime),
    (item) => item.updateTime
  )
    .map(
      (item) =>
        `- [x] ${item.updateTime} —— [${item.name}](/${item.path.replace(
          /\s/g,
          ''
        )})`
    )
    .join('\n')
}

try {
  // 组装 MD 头部
  let md = MD_HEADER

  // 组装列表数据
  const result = await Promise.all(getDirectoryInfo())
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
