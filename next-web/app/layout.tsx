import type { Metadata } from "next";
import "./globals.css";
import "./phase1.css";
import "./sprint2.css";
import "./sprint3.css";
import "./sprint4.css";
import "./brand-system.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { AuthProvider } from "@/components/auth-provider";
import { FloatingConsultation } from "@/components/floating-consultation";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zhiyincareer.com"),
  title: { default: "职引 Career｜大学生求职，从这里开始", template: "%s｜职引 Career" },
  description: "面向大学生与留学生的求职工作台，连接职位发现、简历准备、申请管理与面试训练。",
  openGraph: { type: "website", locale: "zh_CN", siteName: "职引 Zhiyin Career" },
  icons: { icon: "/brand-logo.png", apple: "/brand-logo.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><AuthProvider><SiteHeader /><div className="site-content">{children}</div><SiteFooter /><FloatingConsultation /><AnalyticsProvider /></AuthProvider></body>
    </html>
  );
}
