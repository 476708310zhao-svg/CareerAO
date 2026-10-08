import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <div className="not-found"><span>404</span><h1>这个职位暂时找不到了</h1><p>职位可能已经下线，去职位中心看看新的机会吧。</p><Link href="/jobs" className="button button-primary"><ArrowLeft size={17} />返回职位中心</Link></div>;
}
