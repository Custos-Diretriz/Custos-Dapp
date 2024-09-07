import Hero from "@/components/home/hero";
import Navbar from "@/components/navbar";
// import Footer from "@/components/footer";
import Agree from "@/components/home/agree";

export default function Home() {
  return (
    <div className="min-h-screen kanit">
      <main className="kanit">
        <div className="mb-10 px-6">
          <Navbar />
        </div>
        <Hero />
        <Agree />
      </main>
    </div>
  );
}
