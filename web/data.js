/* Dated research snapshot. See docs/data-maintenance.md; no live price or stock feed. */
var BagelData = {
  "version": "open-source-candidate-2026-10-17-v01",
  "checked": "2026-10-13",
  "models": [
    {
      "id": "a1-mini",
      "name": "A1 mini",
      "series": "A",
      "image": "./assets/a1-mini.svg",
      "build": {
        "single": [
          180,
          180,
          180
        ]
      },
      "display": "180 × 180 × 180 mm",
      "architecture": "开放式单喷嘴",
      "enclosed": false,
      "dual": false,
      "active": false,
      "chamber": "无主动腔温加热",
      "expansionNote": null,
      "nozzleMax": 300,
      "bedMax": 80,
      "tradeoff": "18 厘米标称范围适合先比较小件路线；开放结构的运动、料架和接触安排另核。",
      "combo": "AMS lite（具体套餐另核）",
      "historicalPrice": {
        "model_id": "a1-mini",
        "model": "A1 mini",
        "variant": "historical_multicolor_bundle",
        "reference_min": 1700,
        "reference_max": 1700,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 1700 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S01",
        "S25"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "architecture": "new_official",
        "active_chamber": "inherited"
      },
      "stock": "未核",
      "device": [
        347,
        315,
        365
      ],
      "motionNote": "官方指南 Y 方向图示 390 mm；不是整套摆放矩形。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "a1",
      "name": "A1",
      "series": "A",
      "image": "./assets/a1.svg",
      "build": {
        "single": [
          256,
          256,
          256
        ]
      },
      "display": "256 × 256 × 256 mm",
      "architecture": "开放式单喷嘴",
      "enclosed": false,
      "dual": false,
      "active": false,
      "chamber": "无主动腔温加热",
      "expansionNote": null,
      "nozzleMax": 300,
      "bedMax": 100,
      "tradeoff": "比 mini 有更大的标称范围；开放结构要量热床移动、料架、线缆与维护空间。",
      "combo": "AMS lite（具体套餐另核）",
      "historicalPrice": {
        "model_id": "a1",
        "model": "A1",
        "variant": "historical_multicolor_bundle",
        "reference_min": 1900,
        "reference_max": 1900,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 1900 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S02",
        "S26"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "architecture": "new_official",
        "active_chamber": "inherited"
      },
      "stock": "未核",
      "device": [
        465,
        410,
        430
      ],
      "motionNote": "官方指南 Y 方向图示 545 mm；不是整套摆放矩形。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "a2l",
      "name": "A2L",
      "series": "A",
      "image": "./assets/a2l.svg",
      "build": {
        "single": [
          330,
          320,
          325
        ]
      },
      "display": "330 × 320 × 325 mm",
      "architecture": "开放式单喷嘴",
      "enclosed": false,
      "dual": false,
      "active": false,
      "chamber": "无主动腔温加热",
      "expansionNote": "最多 4 台 AMS/AMS 2 Pro/AMS HT 与 1 台 lite，至高 19 色；烘干另核外电源；不表示套装全部包含",
      "nozzleMax": 300,
      "bedMax": 80,
      "tradeoff": "开放式大尺寸路线；热床最高 80℃，不能仅凭大体积推断高温材料能力。",
      "combo": "AMS lite / AMS 2 Pro 等，按所选配置核",
      "historicalPrice": null,
      "prices": {},
      "sourceIds": [
        "S05",
        "S06"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "architecture": "new_official",
        "active_chamber": "inherited"
      },
      "stock": "未核",
      "device": null,
      "motionNote": "机身、料架、运动和维护空间待核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "p1s",
      "name": "P1S",
      "series": "P",
      "image": "./assets/p1s.svg",
      "build": {
        "single": [
          256,
          256,
          256
        ]
      },
      "display": "256 × 256 × 256 mm",
      "architecture": "封闭式 CoreXY 单喷嘴",
      "enclosed": true,
      "dual": false,
      "active": false,
      "chamber": "无主动腔温加热",
      "expansionNote": null,
      "nozzleMax": 300,
      "bedMax": 100,
      "tradeoff": "封闭单喷嘴路线；尺寸和温度沿用上一轮研究，磨蚀材料还要核升级配置。",
      "combo": "AMS 料路与升级条件另核",
      "historicalPrice": {
        "model_id": "p1s",
        "model": "P1S",
        "variant": "historical_multicolor_bundle",
        "reference_min": 2450,
        "reference_max": 2600,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 2450-2600 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S07",
        "S08",
        "S10",
        "S24"
      ],
      "provenance": {
        "build": "inherited",
        "temperatures": "inherited",
        "enclosure": "new_official",
        "active_chamber": "inherited",
        "corexy": "inherited"
      },
      "stock": "未核",
      "device": null,
      "motionNote": "机身、料架、运动和维护空间待核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "p2s",
      "name": "P2S",
      "series": "P",
      "image": "./assets/p2s.svg",
      "build": {
        "single": [
          256,
          256,
          256
        ]
      },
      "display": "256 × 256 × 256 mm",
      "architecture": "封闭式单喷嘴",
      "enclosed": true,
      "dual": false,
      "active": false,
      "chamber": "无主动腔温加热",
      "expansionNote": "最多 4 台 AMS 2 Pro+4 台 AMS HT=20料槽；待机/打印中其他 AMS 烘干供电条件不同",
      "nozzleMax": 300,
      "bedMax": 110,
      "tradeoff": "封闭单喷嘴路线，无主动腔温加热；换料、烘干供电和实际套餐另核。",
      "combo": "AMS 2 Pro 等，按所选配置核",
      "historicalPrice": {
        "model_id": "p2s",
        "model": "P2S",
        "variant": "historical_multicolor_bundle",
        "reference_min": 3500,
        "reference_max": 3500,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 3500 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S09",
        "S10"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "active_chamber": "new_official",
        "architecture": "inherited",
        "device": "official_rechecked_2026-10-14"
      },
      "stock": "未核",
      "device": [
        392,
        406,
        478
      ],
      "motionNote": "本轮官网核外形尺寸；整套料架、开门、排料、线缆与维护空间另核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "x2d",
      "name": "X2D",
      "series": "X",
      "image": "./assets/x2d.svg",
      "build": {
        "main": [
          256,
          256,
          260
        ],
        "auxiliary": [
          235.5,
          256,
          256
        ],
        "dual_intersection": [
          235.5,
          256,
          256
        ],
        "dual_union": [
          256,
          256,
          260
        ]
      },
      "display": "256 × 256 × 260 mm；双喷共同区 235.5 × 256 × 256 mm",
      "architecture": "封闭式主辅双喷嘴",
      "enclosed": true,
      "dual": true,
      "active": true,
      "chamber": "主动腔温，最高 65℃",
      "expansionNote": null,
      "nozzleMax": 300,
      "bedMax": 120,
      "tradeoff": "主辅双喷嘴有不同工作范围与材料限制；辅助能力不能直接照搬主喷嘴。",
      "combo": "AMS 与主辅料路，按具体配置核",
      "historicalPrice": {
        "model_id": "x2d",
        "model": "X2D",
        "variant": "historical_multicolor_bundle",
        "reference_min": 4500,
        "reference_max": 4500,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 4500 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S11"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "active_chamber": "new_official",
        "architecture": "new_official",
        "device": "official_rechecked_2026-10-14"
      },
      "stock": "未核",
      "device": [
        392,
        406,
        478
      ],
      "motionNote": "本轮官网核外形尺寸；整套料架、开门、排料、线缆与维护空间另核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "h2s",
      "name": "H2S",
      "series": "H",
      "image": "./assets/h2s.svg",
      "build": {
        "single": [
          340,
          320,
          340
        ]
      },
      "display": "340 × 320 × 340 mm",
      "architecture": "封闭式单喷嘴",
      "enclosed": true,
      "dual": false,
      "active": true,
      "chamber": "主动腔温，最高 65℃",
      "expansionNote": null,
      "nozzleMax": 350,
      "bedMax": 120,
      "tradeoff": "封闭大尺寸单喷嘴路线，有主动腔温；需要更多实际摆放和维护空间。",
      "combo": "AMS 配置另核",
      "historicalPrice": null,
      "prices": {},
      "sourceIds": [
        "S12"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "active_chamber": "new_official",
        "architecture": "inherited"
      },
      "stock": "未核",
      "device": null,
      "motionNote": "机身、料架、运动和维护空间待核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "h2d",
      "name": "H2D",
      "series": "H",
      "image": "./assets/h2d.svg",
      "build": {
        "single": [
          325,
          320,
          325
        ],
        "dual_intersection": [
          300,
          320,
          320
        ],
        "dual_union": [
          350,
          320,
          320
        ]
      },
      "display": "325 × 320 × 325 mm；双喷共同区 300 × 320 × 320 mm",
      "architecture": "封闭式双喷嘴",
      "enclosed": true,
      "dual": true,
      "active": true,
      "chamber": "主动腔温，最高 65℃",
      "expansionNote": null,
      "nozzleMax": 350,
      "bedMax": 120,
      "tradeoff": "双喷嘴共同区与并集不同；350 毫米并集不能承诺两材料覆盖整个零件。",
      "combo": "AMS 与双喷嘴料路另核",
      "historicalPrice": {
        "model_id": "h2d",
        "model": "H2D",
        "variant": "historical_multicolor_bundle",
        "reference_min": 8000,
        "reference_max": 8000,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 8000 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S13"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "active_chamber": "new_official",
        "architecture": "new_official"
      },
      "stock": "未核",
      "device": null,
      "motionNote": "机身、料架、运动和维护空间待核。",
      "imageCaption": "结构示意，非机型实拍"
    },
    {
      "id": "h2c",
      "name": "H2C",
      "series": "H",
      "image": "./assets/h2c.svg",
      "build": {
        "left": [
          325,
          320,
          320
        ],
        "right": [
          305,
          320,
          325
        ],
        "dual_intersection": [
          300,
          320,
          320
        ],
        "dual_union": [
          330,
          320,
          320
        ]
      },
      "display": "325 × 320 × 320 mm；双喷共同区 300 × 320 × 320 mm",
      "architecture": "封闭式双喷嘴+Vortek 热端切换",
      "enclosed": true,
      "dual": true,
      "active": true,
      "chamber": "主动腔温，最高 65℃",
      "expansionNote": null,
      "nozzleMax": 350,
      "bedMax": 120,
      "tradeoff": "Vortek 热端切换优势有热端、料路和任务条件；不等于任意任务或套餐零废料。",
      "combo": "AMS 与热端配置另核",
      "historicalPrice": {
        "model_id": "h2c",
        "model": "H2C",
        "variant": "historical_multicolor_bundle",
        "reference_min": 13000,
        "reference_max": 13000,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": "AMS 2 Pro x 2 (原长图备注)",
        "complete_contents_verified": false,
        "price_label": "约 13000 元",
        "current_1111_amount": null
      },
      "prices": {},
      "sourceIds": [
        "S14",
        "S15"
      ],
      "provenance": {
        "build": "new_official",
        "temperatures": "new_official",
        "active_chamber": "new_official",
        "architecture": "new_official"
      },
      "stock": "未核",
      "device": null,
      "motionNote": "机身、料架、运动和维护空间待核。",
      "imageCaption": "结构示意，非机型实拍"
    }
  ],
  "historicalReference": {
    "version": "V04.1",
    "transcribed_at": "2026-10-13",
    "region": "中国大陆",
    "currency": "CNY",
    "period": "618时期，用户本轮指明；原图未印精确日期",
    "year_printed_on_image": null,
    "authorization": "用户要求沿用其618时期价格作参考；不用于双十一当前价格通过",
    "source_type": "user_historical_record",
    "source_table_sha256": "0A2A4415EEEA215A185DD6D6E87650B06600085954FEF7B786FC4E3D4478ACCA",
    "source_heading": "多色套装参考价",
    "image_inspected": true,
    "rows": [
      {
        "model_id": "a1-mini",
        "model": "A1 mini",
        "variant": "historical_multicolor_bundle",
        "reference_min": 1700,
        "reference_max": 1700,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 1700 元",
        "current_1111_amount": null
      },
      {
        "model_id": "a1",
        "model": "A1",
        "variant": "historical_multicolor_bundle",
        "reference_min": 1900,
        "reference_max": 1900,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 1900 元",
        "current_1111_amount": null
      },
      {
        "model_id": "p1s",
        "model": "P1S",
        "variant": "historical_multicolor_bundle",
        "reference_min": 2450,
        "reference_max": 2600,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 2450-2600 元",
        "current_1111_amount": null
      },
      {
        "model_id": "p2s",
        "model": "P2S",
        "variant": "historical_multicolor_bundle",
        "reference_min": 3500,
        "reference_max": 3500,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 3500 元",
        "current_1111_amount": null
      },
      {
        "model_id": "x2d",
        "model": "X2D",
        "variant": "historical_multicolor_bundle",
        "reference_min": 4500,
        "reference_max": 4500,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 4500 元",
        "current_1111_amount": null
      },
      {
        "model_id": "h2d",
        "model": "H2D",
        "variant": "historical_multicolor_bundle",
        "reference_min": 8000,
        "reference_max": 8000,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": null,
        "complete_contents_verified": false,
        "price_label": "约 8000 元",
        "current_1111_amount": null
      },
      {
        "model_id": "h2c",
        "model": "H2C",
        "variant": "historical_multicolor_bundle",
        "reference_min": 13000,
        "reference_max": 13000,
        "approximate": true,
        "single_amount": null,
        "ams_model_confirmed": "AMS 2 Pro x 2 (原长图备注)",
        "complete_contents_verified": false,
        "price_label": "约 13000 元",
        "current_1111_amount": null
      }
    ],
    "unrecorded_models": [
      "A2L",
      "H2S",
      "P3S",
      "P3SC",
      "H3C"
    ],
    "channel": null,
    "discount_eligibility": null,
    "exact_record_date": null,
    "excluded_columns": [
      "定位/档位",
      "适合人群",
      "稳定性和性能评价"
    ],
    "other_prices_not_mixed": [
      "10月九机展示价",
      "官方微博618补贴起价",
      "初上市价"
    ],
    "allowed_use": [
      "预算量级参考",
      "纸面候选比较"
    ],
    "not_verified": [
      "双十一价格",
      "库存",
      "运费",
      "确切套餐箱单",
      "完整入坑费用"
    ],
    "source_display": "作者的618时期多色套装历史记录"
  },
  "priceNote": "近期参考：2026-10-16 用户反馈 A1 单机 899 元、X2D AMS 套装约 4,000 元，尚未独立核价。渠道、优惠条件和箱单待确认；其余机型保留 618 多色套装历史记录，均不代表实时成交价或完整入坑费用。",
  "sources": [
    {
      "id": "S01",
      "title": "A1 mini 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/a1-mini/tech-specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "打印尺寸、温度、传感器、外形和操作系统",
      "publication_date": null
    },
    {
      "id": "S02",
      "title": "A1 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/a1/tech-specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "同 S01",
      "publication_date": null
    },
    {
      "id": "S03",
      "title": "A1 mini 中文快速入门指南",
      "url": "https://cdn1.bambulab.com/documentation/quick-start-f507128172bdf/Quick%20start%20guide%20-%20A1%20mini-%E4%B8%AD%E6%96%87.pdf",
      "region": "中文官方文档",
      "access_level": "pdf_text",
      "checked_at": "2026-10-13",
      "support": "PDF 第 9 页通电；Y 方向热床运动安全空间图示 390 mm",
      "publication_date": null
    },
    {
      "id": "S04",
      "title": "A1 中文快速入门指南",
      "url": "https://cdn1.bambulab.com/documentation/quick-start-f507128172bdf/Quick%20start%20guide%20-%20A1-%E4%B8%AD%E6%96%87.pdf",
      "region": "中文官方文档",
      "access_level": "pdf_text",
      "checked_at": "2026-10-13",
      "support": "PDF 第 17 页通电；Y 方向热床运动安全空间图示 545 mm",
      "publication_date": null
    },
    {
      "id": "S05",
      "title": "A2L 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/a2l/specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "330×320×325 mm、300/80℃、外形、喷嘴升级",
      "publication_date": null
    },
    {
      "id": "S06",
      "title": "A2L 中国 FAQ",
      "url": "https://bambulab.cn/zh-cn/a2l/faq",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "开放式、AMS 扩展及供电、刀切可选、不支持激光",
      "publication_date": null
    },
    {
      "id": "S07",
      "title": "P1 中国产品页",
      "url": "https://bambulab.cn/zh-cn/p1",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "P1S 封箱、AMS、断料检测与断电续打；不是库存证据",
      "publication_date": null
    },
    {
      "id": "S08",
      "title": "P1S 中文快速入门指南",
      "url": "https://cdn1.bambulab.com/documentation/quick-start-0fa3c8ddd3d3f/P1S/Chinese%20version-Quick%20Start%20Guide%20for%20P1S.pdf",
      "region": "中文官方文档",
      "access_level": "retrieved_text_unreadable",
      "checked_at": "2026-10-13",
      "support": "PDF 获取成功但本次无法提取正文；尺寸和温度不得算作本轮新核",
      "publication_date": null
    },
    {
      "id": "S09",
      "title": "P2S 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/p2s/specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-14",
      "support": "尺寸、温度、喷嘴、传感器；本轮重新核对机身外形尺寸",
      "publication_date": null
    },
    {
      "id": "S10",
      "title": "P2S 中国 FAQ",
      "url": "https://bambulab.cn/zh-cn/p2s/faq",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "无主动腔温加热、AMS/供电、暂无 P1S 停售计划",
      "publication_date": null
    },
    {
      "id": "S11",
      "title": "X2D 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/x2d/specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-14",
      "support": "主辅喷范围、主动腔温、各喷嘴材料及谨慎打印脚注；本轮重新核对机身外形尺寸",
      "publication_date": null
    },
    {
      "id": "S12",
      "title": "H2S 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/h2s/tech-specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "单喷范围、主动腔温、温度与版本差异",
      "publication_date": null
    },
    {
      "id": "S13",
      "title": "H2D 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/h2d/tech-specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "单喷/交集/并集、主动腔温、温度",
      "publication_date": null
    },
    {
      "id": "S14",
      "title": "H2C 中国技术参数",
      "url": "https://bambulab.cn/zh-cn/h2c/specs",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "左右单喷/交集/并集、主动腔温、温度",
      "publication_date": null
    },
    {
      "id": "S15",
      "title": "H2C 中国产品页",
      "url": "https://bambulab.cn/zh-cn/h2c",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "Vortek 条件、初始冲刷例外、官方项目不背书",
      "publication_date": null
    },
    {
      "id": "S16",
      "title": "A2L AMS Combo 官方英文手册",
      "url": "https://csm.bblcdn.com/hub/4efdb4e04ab34111a8da112e81028430.pdf",
      "region": "官方国际英文文档",
      "access_level": "pdf_text",
      "checked_at": "2026-10-13",
      "support": "PDF 第 49 页/印刷页 48：AMS lite 材料规格；网页工具因 10.9MB 超限，常规 HTTPS 读取后内存解析，无登录绕过",
      "publication_date": null
    },
    {
      "id": "S17",
      "title": "TPU for AMS 中国耗材页",
      "url": "https://bambulab.cn/zh-cn/filament/tpu-for-ams",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "具体产品、68D、烘干；本页未单列 AMS lite",
      "publication_date": null
    },
    {
      "id": "S18",
      "title": "TPU 95A HF 中国耗材页",
      "url": "https://bambulab.cn/zh-cn/filament/tpu-95a-hf",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "具体产品与烘干；本页未单列 AMS lite",
      "publication_date": null
    },
    {
      "id": "S19",
      "title": "TPU 95A HF 英国官方商店",
      "url": "https://uk.store.bambulab.com/collections/all/products/tpu-95a-hf",
      "region": "英国",
      "access_level": "search_excerpt",
      "checked_at": "2026-10-13",
      "support": "官方检索摘录明确 AMS/AMS lite 不兼容；正文直读 402，不当作成功阅读全文",
      "publication_date": null
    },
    {
      "id": "S20",
      "title": "TPU for AMS 英国官方商店",
      "url": "https://uk.store.bambulab.com/collections/pc-tpu/products/tpu-for-ams",
      "region": "英国",
      "access_level": "search_excerpt",
      "checked_at": "2026-10-13",
      "support": "官方检索摘录明确 AMS/AMS lite 兼容及 0.2 mm 不兼容；正文直读 402",
      "publication_date": null
    },
    {
      "id": "S21",
      "title": "MakerWorld 一步打印官方说明",
      "url": "https://blog.bambulab.com/makerworld-one-step-printing/",
      "region": "官方国际英文",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "2023-09-22；模型、打印配置、耗材参数及云切片流程，STL 缺切片设置",
      "publication_date": "2023-09-22"
    },
    {
      "id": "S22",
      "title": "Autodesk Fusion 个人用途条件",
      "url": "https://www.autodesk.com/products/fusion-360/personal",
      "region": "官方国际英文",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "个人家庭非商业且年收入条件；不能主要职业/公司环境/商业培训",
      "publication_date": null
    },
    {
      "id": "S23",
      "title": "中国官方机型比较",
      "url": "https://bambulab.cn/zh-cn/compare",
      "region": "中国大陆",
      "access_level": "full_text_with_missing_boolean_rendering",
      "checked_at": "2026-10-13",
      "support": "默认三款；初上市价为历史价；字段名没有可读勾叉，不据此确认存在",
      "publication_date": null
    },
    {
      "id": "S24",
      "title": "P1P EOL 与 P1S 说明",
      "url": "https://blog.bambulab.com/a-farewell-to-p1p/",
      "region": "官方国际英文",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "2026-02-10；P1S 继续生产销售的公告，非中国实时库存",
      "publication_date": "2026-02-10"
    },
    {
      "id": "S25",
      "title": "A1 mini 中国产品页",
      "url": "https://bambulab.cn/zh-cn/a1-mini",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "主动降噪及静音模式下低于 48 dB；未提供完整测量条件",
      "publication_date": null
    },
    {
      "id": "S26",
      "title": "A1 中国产品页",
      "url": "https://bambulab.cn/zh-cn/a1",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "同 S25；AMS lite 方案",
      "publication_date": null
    },
    {
      "id": "S27",
      "title": "X1E 中国产品页",
      "url": "https://bambulab.cn/zh-cn/x1e",
      "region": "中国大陆",
      "access_level": "full_text",
      "checked_at": "2026-10-13",
      "support": "企业网络、320℃、主动腔温 60℃；不推导 X1C 具有主动腔温",
      "publication_date": null
    }
  ],
  "tpuMatrix": [
    {
      "product": "第三方通用 TPU／未给 SKU 的 TPU",
      "printer_capability": "未知，逐硬度和具体产品核；A1/mini 规格表的 TPU 类别不覆盖所有 SKU",
      "ams_lite_feeding": "官方 AMS lite 规格不支持 generic TPU",
      "auxiliary_nozzle": "逐机型/产品核，不从机器主喷支持表推断",
      "provenance": "new_official",
      "source_ids": [
        "S01",
        "S02",
        "S16"
      ]
    },
    {
      "product": "Bambu TPU 95A HF",
      "printer_capability": "本次中国产品页可读；适配机型、喷嘴和实际预设另核",
      "ams_lite_feeding": "不兼容：英区官方检索摘录明确；正文未直读成功；另有完整 AMS lite 规格将 Bambu TPU 95A 排除",
      "auxiliary_nozzle": "X2D 辅助支持项是 AMS 专用 TPU，不能推普通95A HF可用",
      "provenance": "official_search_excerpt_with_pdf_class_support",
      "source_ids": [
        "S18",
        "S19",
        "S16",
        "S11"
      ]
    },
    {
      "product": "Bambu TPU for AMS",
      "printer_capability": "中国官方确认是单独产品，68D；不能当95A软料等效替代",
      "ams_lite_feeding": "支持该专用产品：本次完整官方 AMS lite 规格列入支持；英区商品摘录旁证",
      "auxiliary_nozzle": "X2D 辅助允许且谨慎打印，主热端优先细节表现",
      "provenance": "new_official_with_search_excerpt",
      "source_ids": [
        "S16",
        "S17",
        "S20",
        "S11"
      ]
    }
  ],
  "provenanceClasses": {
    "new_official": "此次直接读取的一手官方正文/官方 PDF",
    "official_search_excerpt": "此次取得的官方检索摘录，单列低于正文层级；不能伪装直读",
    "inherited": "沿用 2026-10-12_v01/research.json，本次未重新确认该字段",
    "experience": "顾问经验、估计或解释，无官方/实测承载",
    "unverified": "完全未核，保留 null 或待确认"
  },
  "newModels": [
    {
      "id": "p3s",
      "name": "P3S",
      "aliases": [
        "P3SC"
      ],
      "specs": null,
      "price": null,
      "releaseDate": null,
      "status": "网友线索，正式资料待核；销售时间、定价与性能未获核实。",
      "source": "网友线索，收录于2026-10-14；尚无官方核实",
      "recorded_at": "2026-10-14"
    },
    {
      "id": "h3c",
      "name": "H3C",
      "aliases": [],
      "specs": null,
      "price": null,
      "releaseDate": null,
      "status": "网友线索，正式资料待核；销售时间、定价与性能未获核实。",
      "source": "网友线索，收录于2026-10-14；尚无官方核实",
      "recorded_at": "2026-10-14"
    }
  ],
  "historyModels": [
    "P1P",
    "X1 / X1C",
    "X1E",
    "H2D Pro"
  ],
  "boundaryNote": "本工具只按你填写的条件初步比较。没有读取模型文件、切片或实物测试，也不确认房间、材料接触、强度与购买资格。",
  "priceSnapshots": [
    {
      "id": "user-20261016-a1-single",
      "model_id": "a1",
      "currency": "CNY",
      "region": "中国大陆",
      "observed_at": "2026-10-16",
      "source_type": "user_report",
      "source_label": "作者收到的近期用户反馈",
      "independently_verified": false,
      "configuration": "machine_only",
      "configuration_label": "单机",
      "amount": 899,
      "approximate": false,
      "price_label": "899 元（单机）",
      "ams_model": null,
      "channel": null,
      "store": null,
      "coupon_conditions": null,
      "subsidy_eligibility": null,
      "complete_contents_verified": false,
      "stock_verified": false,
      "verification_status": "未独立核价",
      "valid_for_budget_gate": false
    },
    {
      "id": "user-20261016-x2d-ams",
      "model_id": "x2d",
      "currency": "CNY",
      "region": "中国大陆",
      "observed_at": "2026-10-16",
      "source_type": "user_report",
      "source_label": "作者收到的近期用户反馈",
      "independently_verified": false,
      "configuration": "ams_bundle",
      "configuration_label": "AMS 套装",
      "amount": 4000,
      "approximate": true,
      "price_label": "约 4,000 元（AMS 套装）",
      "ams_model": null,
      "channel": null,
      "store": null,
      "coupon_conditions": null,
      "subsidy_eligibility": null,
      "complete_contents_verified": false,
      "stock_verified": false,
      "verification_status": "未独立核价",
      "valid_for_budget_gate": false
    }
  ],
  "assetProfile": "public-schematic"
};
if(typeof module!=="undefined"&&module.exports)module.exports=BagelData;
