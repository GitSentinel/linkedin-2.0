import UserInformation from "@/components/UserInformation";
import Image from "next/image";

export default function Home() {
  return (
    <main className="grid">
      <section>
        <UserInformation />
      </section>
    </main>
  );
}
