import { redirect } from "next/navigation";

export default async function Notes() {
  redirect("/notes/filter/all");
  return;
}
