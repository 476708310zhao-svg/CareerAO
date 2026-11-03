export type JobRegionGuide = {
  slug: string;
  name: string;
  filterValue: string;
  title: string;
  description: string;
  focus: string;
  searches: string[];
  steps: { title: string; detail: string }[];
};

export const jobRegionGuides: JobRegionGuide[] = [
  {
    slug: "china",
    name: "中国内地",
    filterValue: "中国",
    title: "中国内地校招与实习岗位怎么找",
    description: "从企业招聘官网核对届别、城市、截止日期和投递入口，建立适合自己的校招与实习清单。",
    focus: "国内校招通常把同一企业的不同城市、方向和届别放在不同招聘批次中。先确认自己符合哪个批次，再核对岗位要求和投递截止时间。",
    searches: ["实习", "校招", "数据分析"],
    steps: [
      { title: "确认届别与招聘类型", detail: "打开企业公告核对毕业时间要求，区分日常实习、暑期实习和应届校招；页面未写明时不要自行推断。" },
      { title: "按城市和方向缩小范围", detail: "先选目标城市，再用岗位名称和技能关键词搜索；同名岗位可能在多个事业部单独发布。" },
      { title: "留存官网证据", detail: "记录岗位原始链接、招聘批次、投递日期和下一步动作。岗位状态以企业招聘官网为准。" },
    ],
  },
  {
    slug: "hong-kong",
    name: "中国香港",
    filterValue: "香港",
    title: "香港实习与毕业生岗位怎么找",
    description: "查找香港地区实习和毕业生职位，按岗位原文核对语言、工作地点及申请安排。",
    focus: "香港岗位可能使用中文或英文标题，Graduate Programme、Internship 与具体职能岗位要分别检索。不要把企业所在地当作实际工作地点。",
    searches: ["Internship", "Graduate", "数据分析"],
    steps: [
      { title: "同时使用中英文关键词", detail: "以目标职能为主线，交叉搜索中文岗位名与英文岗位名，避免只搜一种写法。" },
      { title: "核对岗位原文", detail: "查看实际工作地点、语言要求、工作期限和申请材料。签证或工作资格仅以企业原文及官方规定为准。" },
      { title: "区分岗位源状态", detail: "职位源暂时不可用时稍后重试；空结果只表示本次筛选未命中，不等于当地没有岗位。" },
    ],
  },
  {
    slug: "uk",
    name: "英国",
    filterValue: "英国",
    title: "英国 Graduate 与实习岗位怎么找",
    description: "用 Graduate、Internship 和职能关键词寻找英国岗位，核对企业官网说明与岗位开放状态。",
    focus: "英国招聘常见 Graduate Programme、Placement、Internship 等不同入口。相同职能的项目时长、申请资格和截止方式可能不同。",
    searches: ["Graduate", "Internship", "Software Engineer"],
    steps: [
      { title: "先区分项目类型", detail: "根据毕业时间和可工作时段，分别查看毕业生项目、实习和 Placement，不把项目名称视为资格证明。" },
      { title: "核对地点和申请资格", detail: "阅读企业职位页面中的工作地点、在岗要求及工作资格说明；没有明确签证证据时保留未知状态。" },
      { title: "准备申请材料", detail: "记录岗位要求，并把简历经历对应到实际职责；网申问题按真实经历逐题准备。" },
    ],
  },
  {
    slug: "canada",
    name: "加拿大",
    filterValue: "加拿大",
    title: "加拿大 Co-op 与 New Grad 岗位怎么找",
    description: "按 Co-op、Internship、New Grad 和城市检索加拿大机会，核对岗位期限与企业申请页面。",
    focus: "加拿大岗位可能按 Co-op、Internship 或 New Grad 分类，同一岗位标题也可能对应不同省份与办公方式。",
    searches: ["Co-op", "Internship", "Data Analyst"],
    steps: [
      { title: "核对项目要求", detail: "先看是否要求在读、毕业时间或学校 Co-op 项目资格，避免把职位类别等同于个人可申请资格。" },
      { title: "按城市复核地点", detail: "确认企业页面写明的城市、省份和办公方式；Remote 标签也要核对允许工作的地区。" },
      { title: "用原文确认待遇和资格", detail: "薪资、工作许可及签证相关支持只引用该岗位原文明确提供的信息。" },
    ],
  },
  {
    slug: "usa",
    name: "美国",
    filterValue: "美国",
    title: "美国 Internship 与 New Grad 岗位怎么找",
    description: "按 Internship、New Grad、职能和城市查找美国岗位，核对原始职位描述与申请条件。",
    focus: "美国岗位经常按实习、New Grad 和常规全职分别发布。招聘源显示岗位存在，也不代表个人身份条件已经满足。",
    searches: ["Internship", "New Grad", "Software Engineer"],
    steps: [
      { title: "读完整职位要求", detail: "查看毕业时间、在读状态、工作地点和必需技能，再决定是否申请。" },
      { title: "单独核对工作资格", detail: "OPT、CPT 或雇主担保不能从公司名称或行业推断；以岗位原文和可核验的官方信息为准。" },
      { title: "跟踪申请与岗位变化", detail: "保存原始岗位链接、申请日期和版本；岗位关闭或来源异常时重新打开企业官网核对。" },
    ],
  },
];

export function jobSearchHref(region: JobRegionGuide, keyword?: string) {
  const params = new URLSearchParams({ region: region.filterValue });
  if (keyword) params.set("keyword", keyword);
  return `/jobs?${params.toString()}`;
}
