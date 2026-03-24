import { redirect } from "next/navigation";
import { getTokens } from "@/lib/spotify";

export default async function RootPage() {
    const tokens = await getTokens();
    redirect(tokens ? "/dashboard" : "/login");
}
