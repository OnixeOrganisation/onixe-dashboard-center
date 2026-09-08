import { redirect } from "next/navigation";

export default function LoginV1Redirect() {
  redirect("/auth/login");
}
