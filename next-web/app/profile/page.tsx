import type { Metadata } from "next";
import { AuthGate } from "@/components/auth-provider";
import { ProfileLive } from "@/components/profile-live";
export const metadata:Metadata={title:"职业画像",robots:{index:false,follow:false}};
export default function ProfilePage(){return <main className="zy-page"><div className="shell"><AuthGate title="登录后完善职业画像"><ProfileLive/></AuthGate></div></main>}
