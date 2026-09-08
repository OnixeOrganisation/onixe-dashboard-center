import { redirect } from "next/navigation";

export default function RegisterV1Redirect() {
  redirect("/auth/register");
}
