import type { Metadata } from "next";
import { ContactHub } from "@/components/resource-pages";
export const metadata: Metadata = { title: "联系我们", description: "联系职引团队并提交合作、支持或产品建议。", alternates: { canonical: "/contact" } };
export default function Page(){return <ContactHub/>}
