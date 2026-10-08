"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bot, Check, CircleDollarSign, Crown, FileText, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { track } from "@/lib/analytics";
import { featureFlags } from "@/lib/feature-flags";
import { membershipPlans, type MembershipPlan } from "@/lib/sprint4-data";
import { useSprint4Store } from "./use-sprint4-store";

export function MembershipCenter() {
  const { store, setStore } = useSprint4Store();
  const [message, setMessage] = useState("");
  useEffect(() => {
    track("membership_view");
    setStore((current) => +new Date(current.subscription.currentPeriodEnd) < Date.now() && current.subscription.planId !== "free" ? { ...current, subscription: { ...current.subscription, planId: "free", status: "expired" } } : current);
  }, []);
  const currentPlan = membershipPlans.find((plan) => plan.id === store.subscription.planId)!;
  function choose(plan: MembershipPlan) {
    if (plan.id === "free") return;
    if (!featureFlags.wechatPayment) {
      setMessage("真实微信支付暂未开放。方案选择已记录为购买意向，等待资质确认后通知你。");
      setStore((current) => ({ ...current, subscription: { ...current.subscription, orderStatus: "pending" } }));
      track("membership_purchase", { plan_id: plan.id, mode: "intent_only" });
    }
  }
  return <div className="membership-page"><section><span className="section-label">MEMBERSHIP & QUOTAS</span><h1>选择适合你当前阶段的求职能力</h1><p>透明的配额、可配置的权益；暂不启用真实微信支付。</p></section><div className="shell membership-usage"><div><Crown size={19}/><span><b>当前方案：{currentPlan.name}</b><small>{store.subscription.status} · 到期日 {new Date(store.subscription.currentPeriodEnd).toLocaleDateString("zh-CN")}</small></span></div><div className="usage-pills"><span><Bot size={13}/>AI 调用 {store.usage.aiCalls}/{currentPlan.limits.aiCalls}</span><span><MessageSquareText size={13}/>面试训练 {store.usage.interviewSessions}/{currentPlan.limits.interviewSessions}</span><span><FileText size={13}/>简历版本 {currentPlan.limits.resumeVersions === -1 ? "无限" : currentPlan.limits.resumeVersions}</span></div></div>{message && <div className="shell payment-notice"><AlertCircle size={16}/>{message}</div>}<div className="shell plan-grid">{membershipPlans.map((plan) => <article className={plan.id === "pro" ? "featured" : ""} key={plan.id}>{plan.id === "pro" && <em>MOST POPULAR</em>}<div className="plan-icon">{plan.id === "free" ? <ShieldCheck/> : plan.id === "pro" ? <Sparkles/> : <Crown/>}</div><h2>{plan.name}</h2><div className="price"><span>$</span><b>{plan.monthlyPrice}</b><small>/ month</small></div><p>{plan.id === "free" ? "开始建立求职系统" : plan.id === "pro" ? "适合积极申请阶段" : "适合面试冲刺阶段"}</p><ul>{plan.benefits.map((benefit) => <li key={benefit}><Check size={13}/>{benefit}</li>)}</ul><button disabled={plan.id === store.subscription.planId} onClick={() => choose(plan)}>{plan.id === store.subscription.planId ? "当前方案" : plan.id === "free" ? "降级到 Free" : "登记购买意向"}</button></article>)}</div><div className="shell downgrade-policy"><CircleDollarSign size={17}/><div><h3>到期与降级规则</h3><p>会员到期后自动降级为 Free；已有简历和报告只读保留，超出 Free 限额的内容不会删除，新 AI 调用将在下个周期按 Free 配额执行。退款订单保留原始审计状态。</p></div></div></div>;
}
