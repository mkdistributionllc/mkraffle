import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/page/Hero";
import LoginForm from "@/components/auth/LoginForm";

export default function AccountPage() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main>
        <PageHero pageTitle="Account" 
          pageDescription="Manage your account settings and preferences" 
          backgroundImage="/pattern/upholstery.webp"
        />
        <section className="bg-black text-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
