# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

所有正在准备实习、校招与毕业后首份工作的大学生与应届毕业生。他们需要结合专业、经历、毕业时间与目标方向，持续完成岗位筛选、材料准备、投递跟进和面试训练；其中计划海外求职的留学生还需要处理身份、工作许可与签证约束。

## Product Purpose

职引把岗位发现、匹配判断、简历准备、申请管理、面试训练和每日行动组织在同一条求职工作流中。产品成功意味着用户能更快看清下一步，保留申请上下文，并对 AI 生成或写入操作保持控制。

## Positioning

职引以用户的 Career Profile、目标岗位和申请进度为连续上下文，让多个 AI 求职工具围绕同一段真实求职流程协作，而不是提供彼此割裂的单点生成器。

## Operating Context

用户会维护职业画像，按方向与地区筛选岗位，针对职位管理不同简历版本，准备申请材料与沟通内容，跟踪申请状态，完成面试训练，并通过 Today 页面处理优先任务。海外求职场景还会查看签证与 Sponsor 相关信息，并准备 Cover Letter、Recruiter Message 和 Follow-up Email。

## Capabilities and Constraints

- 当前技术栈为 Next.js 15 App Router、React 19、TypeScript 与 CSS，图标来自 Lucide React。
- 已有可运行路由包括 Today、Jobs、Applications、Resume、Interviews、AI Career、Profile、Pricing 与管理分析页。
- AI Career 中的敏感邮箱、手机号和证件号会在发送前脱敏；写操作需要用户确认。
- 官网改版先在 `/preview` 独立路由验证，不替换正式首页或改变已有业务逻辑。
- 真实客户数量、使用成效、评价、资质、安全认证与商业成果尚未提供，不能自行补充。

## Brand Commitments

- 产品名称为“职引 Zhiyin Career”，现有品牌识别以紫色、深色文字和字母 Z 标记为主。
- 保留现有业务术语与中英文混合表达，包括 Career Profile、AI Career、Resume、Offer、CPT、OPT 与 H1B。
- 语气应专业、克制、可信，避免空泛的行业口号和未经证实的承诺。

## Evidence on Hand

- 可运行的产品页面和交互代码位于 `app/` 与 `components/`。
- 现有职位、申请、简历、任务和 AI Agent 演示数据位于 `lib/jobs.ts`、`lib/career-data.ts` 与 `lib/sprint4-data.ts`；面向官网展示时必须标注“演示数据”。
- 每个职位详情页保留官方招聘链接；这是当前可验证的信息来源路径。
- 当前没有可用于官网的真实客户案例、推荐语、合作 Logo、审计认证、媒体报道或量化业务成果。

## Product Principles

- 先解释用户下一步，再展示功能数量。
- 用可直接打开的产品界面证明能力。
- 把目标方向、教育经历与申请上下文视为核心约束；在海外求职场景中同时纳入身份、工作许可与签证要求。
- AI 提供建议，用户保留最终决定和写操作控制权。
- 所有公开证据可追溯，所有演示信息明确标注。

## Accessibility & Inclusion

官网需支持键盘导航、可见焦点、语义结构和可访问名称；在 375px、768px、1024px 与 1440px 宽度下保持完整阅读与操作，不依赖颜色或动画传达关键信息，并尊重减少动态效果偏好。
