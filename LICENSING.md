# 代码与内容分别许可

日期：2026-10-17，版本0.1.2。项目源代码与通用代码素材使用MIT；项目自有笔记、美术与品牌图片使用CC BY-NC 4.0。署名为GitHub维护者 `ericwubeta`，来源为 [项目仓库](https://github.com/ericwubeta/bagel-3d-printer-picker)。小红书主页链接未提供，不据历史资料代填。

## 逐路径范围

| 路径或对象 | 许可 | 边界 |
|---|---|---|
| `web/*.js`、`web/*.css`、`web/index.html` | MIT | `meow-data.js`中的第三方PCM音频例外见下；构建生成的`note-content.js`不属此通配项 |
| `scripts/**`、`tests/**`、`skills/**`、项目编写的维护文档 | MIT | 不授权其中提到的第三方商标、产品原文或外部链接目标 |
| `web/assets/a1-mini.svg`、`a1.svg`、`a2l.svg`、`p1s.svg`、`p2s.svg`、`x2d.svg`、`h2s.svg`、`h2d.svg`、`h2c.svg` | MIT | 本项目通用结构示意，不是厂商实拍或精确尺寸图 |
| `content/notes.json`；构建生成的`note-content.js`中的对应笔记数据 | CC-BY-NC-4.0 | 标题、关键词、作者摘记、账号引导；不覆盖朋友原文或外部原笔记的第三方内容 |
| `web/assets/bagel-extra-poses.png`、`bagel-poses-soft-v02.png`、`welcome-pose-0.png`至`welcome-pose-7.png` | CC-BY-NC-4.0 | 仅就项目有权许可的图像创作部分；来源和哈希逐项记录 |
| `web/meow-data.js`中的Base64 PCM音频数据 | CC0-1.0 | 原作者tuberatanka；JS程序包装是MIT，不给音频叠加NC限制 |
| 独立Logo、其他品牌图片 | 当前未纳入文件清单 | 授权方向为CC BY-NC 4.0；实际加入前须核来源并逐路径登记，不能据此自动纳入未知素材 |
| `private-assets/*.png`与含厂家照片的品牌运行包 | 不纳入上述公开许可 | 本地保留使用素材，不随公开源码分发，不作为公开Release附件 |

机器可读清单见 [licensing/asset-map.json](licensing/asset-map.json)，实际分发物携带 [licensing/runtime-attribution.json](licensing/runtime-attribution.json)。MIT全文见 [LICENSE](LICENSE)；CC官方法律文本原样保留在 [LICENSES/CC-BY-NC-4.0.txt](LICENSES/CC-BY-NC-4.0.txt)。逐项例外优先于默认代码许可；这里不是`MIT OR CC-BY-NC-4.0`供使用者任择。

## 使用内容素材

CC BY-NC 4.0允许非商业分享和改编，须保留适当署名、许可链接及改动说明。不要求只能运行未改名的原样副本，也没有另加禁止提取、禁止训练或必须同许可发布的条款。商业使用项目代码仍可遵循MIT，但其中的NC素材须另获商业许可或替换。

此授权不自动包含商标、专利、隐私或第三方权利，也不允许暗示项目作者、贝果账号或厂商对衍生产品背书。具体条件以 [CC官方文本](https://creativecommons.org/licenses/by-nc/4.0/legalcode.en)为准。

## 公开范围与检查

[licensing/publication.json](licensing/publication.json) 记录维护者署名、仓库地址与2026-10-17的公开推送指令。小红书主页链接可后补，保持 `null` 不影响现有GitHub署名。

旧欢迎字层的字体取得与输出使用依据仍未核清，两个栅格文件均已排除出公开源码和构建，改为设备原生字体在Canvas绘制相同短句。不将未核来源标为已验证，也不分发字体二进制。

运行 `node scripts/preflight.cjs` 检查暂存路径覆盖、许可文本、来源及推送条件。预检不执行远程操作，也不等于小红书平台或真机验收。
