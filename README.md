# 贝果陪你选 · 3D打印机

五个问题，看看哪款更适合你。一个无需联网的拓竹选机小工具。选机 Agent Skill 已迁到独立仓库。

当前为 **2026-10-19 小工具 1.0.1（源码版本 1.0.1）**，仓库为 [ericwubeta/bagel-3d-printer-picker](https://github.com/ericwubeta/bagel-3d-printer-picker)。本次仅发布源码，不部署网站或发布新版小红书小工具。代码与保留的通用结构图采用 MIT；项目自有笔记和贝果美术素材采用 CC BY-NC 4.0，允许非商业分享与改编。署名使用已验证的 GitHub 维护者账号 `ericwubeta`，小红书主页链接尚未提供。具体范围及第三方例外见 [LICENSING.md](LICENSING.md)。

## 可以做什么

- 每次一个选择题：位置 → 总预算 → 第一件作品大小 → 用途 → 颜色做法。
- 返回一到两款值得比较的机型，解释新增能力、取舍和买前待核项。
- 位置或关键条件未定时，把准备行动放在结果前面。卧室先建议换位置。
- 保留全系能力路线、心仪高配、相关笔记和新品猜想。
- 本地运行，不调用服务器、不采集问卷、不需要账号、API key 或数据库。

这是一份普通玩家的选机起点。离线引擎采用固定预算档的比较路线，**不是实时最低价搜索或全市场最优推荐**。作品尺寸类比、房间名称、机器档位均不等于实际适配通过。

## 运行与打包

需要 Node.js 18+；打 ZIP 另需 Python 3.9+。不需要 `npm install`，运行时及构建无第三方依赖。用 `python3` 的系统请将下方 `python` 换成 `python3`。

```sh
node scripts/build.cjs --mode public
node scripts/validate.cjs --mode public
npm test
node scripts/serve.cjs --mode public --port 5200
```

浏览器打开 `http://127.0.0.1:5200/`。停止服务用 Ctrl+C。

```sh
python scripts/package.py --mode public
```

上传包输出到 `output/bagel-printer-picker-public-v1.0.1.zip`，ZIP根目录直接是`index.html`，包内`licensing/runtime-attribution.json`携带许可正文及来源。源码仓库或源码ZIP不能当作小红书运行包上传。验证和逐文件哈希位于被忽略的`output/`。

默认构建现在使用 **此前小工具及视频使用的9张拓竹官网产品图**，无需私人目录即可得到相同机型图片。它们不是作者实拍，也不受本项目MIT或CC BY-NC 4.0许可覆盖；版权保留于原权利人，未宣称已取得厂商的公开再分发许可。逐文件哈希及来源记录见 [licensing/product-images.json](licensing/product-images.json) 和 [第三方产品图说明](LICENSES/Bambu-Product-Images.txt)。

`public` 与 `brand` 默认使用同一套已入库产品图；`brand` 保留为原本地打包入口。只有显式传入 `--private-assets <目录>` 时，才读取本地替换图片，私人目录仍不提交。原9张MIT结构SVG保留为源码参考，不作为默认显示或运行包资源。

```sh
node scripts/build.cjs --mode brand
node scripts/validate.cjs --mode brand
python scripts/package.py --mode brand
```

本次同步同时更新了结果卡片、全系能力图和机型详情的数据引用，以及默认构建、素材声明和校验规则。题面、推荐逻辑、价格记录、贝果动作、笔记正文与猫叫未改变。对照结果见 [图片同步检查](docs/asset-sync-2026-10-19.md)。

## 独立的选机 Skill

选机方法已迁到 [ericwubeta/bagel-printer-advisor](https://github.com/ericwubeta/bagel-printer-advisor)。Skill的安装、使用和维护以该仓库为准；本仓库不再附带 `skills/` 目录，构建也不依赖它。原0.1.2合并版本仍可在Git历史中追溯。

本次拆分保持小工具五轮题面、推荐规则、画面、笔记内容、角色动作与猫叫不变。产品版本按1.0.1标识；源码包和运行包的完整版本为1.0.1。近期价格仍是10月16日的用户反馈，没有冒充10月19日重新核价。

## 价格与产品事实

- 参数资料保留原核验日期（主要为2026-10-13/14）；本轮整理不冒充重新核到全部官方参数。
- 原618多色套装记录仍是历史参考，原图没有精确日期或年份。
- 2026-10-16用户反馈：**A1单机约899元；X2D AMS套装约4000元**。不是本项目独立核验的官方成交价；店铺、AMS具体箱单、券/补贴资格、运费及库存未知。
- 单机、套装和完整入坑费用分开看。参考价不会自动成为预算通过证据。
- P3S（含历史别称P3SC）及H3C仅按带日期的网友线索保留；没有核到官方消息的参数、定价和销售时间保持未知。

产品数据在`web/data.js`，题面在`web/questions.js`，判断在`web/engine.js`。笔记数据在`content/notes.json`，MIT查询包装在`web/notes.js`；构建生成外置`note-content.js`，运行时不发起JSON请求。更新方式和验证边界见 [docs/maintenance.md](docs/maintenance.md)。

## 平台与测试边界

产物使用外置经典JS、本地相对资源和ES2017写法，按 [小红书容器官方文档](https://miniapp-sandbox.xiaohongshu.com/minitool/doc) 的Chrome61基线检查（本轮读取2026-10-19，页面标注更新2026-10-13）。不调用未公布的跳转或剪贴板能力；笔记入口为本地摘记和账号内查找引导。

软件测试、静态扫描与现代浏览器走查不等于小红书平台验收：创服模拟器、Android真机、iOS真机均**待验证**；Chrome61旧内核、真机声音和性能未实测。本项目没有把模拟角色对话写成真人测试。

## 文件与许可

| 路径 | 内容 |
|---|---|
| `web/` | 实际运行的HTML、CSS、JS和必要素材 |
| `scripts/` | 可独立运行的构建、校验、预览、ZIP脚本 |
| `tests/` | 推荐逻辑与数据边界回归 |
| `content/` | CC BY-NC 4.0的笔记数据 |
| `licensing/`、`LICENSES/` | 逐路径许可、来源署名与法律文本 |
| `docs/` | 维护方法、来源和边界 |

小工具代码为 [MIT](LICENSE)，笔记及项目自有贝果图片为 [CC BY-NC 4.0](ASSET-LICENSE.md)。两者按路径适用，MIT不覆盖NC内容，不是任选一种许可。9张官网产品图单列第三方权利说明；猫叫E保留tuberatanka的CC0，详见 [第三方说明](THIRD_PARTY_NOTICES.md)。贝果照片原图、朋友参考图、研究访谈、私有路径、原始抓取网页和视频均未纳入公开源码候选。目前未纳入独立Logo文件；今后加入时须逐项登记来源。

## 推送前检查

```sh
node scripts/update-license-notices.cjs
node scripts/preflight.cjs
```

预检检查实际暂存文件、逐文件许可和来源哈希。公开署名采用 `ericwubeta`；未提供的小红书主页链接是可选信息，不伪造或跳转到猜测账号。两张未核清字体来源的旧欢迎字层已排除，改为浏览器系统字体绘制相同短句，贝果动作图保持原样。原始工程与素材留在本地，不随仓库发布。

预检退出码 0 表示源码满足本项目的推送检查；1 表示结构错误，2 表示仍有必需待办。它不代替平台或真机验收。
