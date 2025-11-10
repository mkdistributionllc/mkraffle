import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/page/Hero";
import AccountContainer from "@/components/account/Container";

export default function AccountPage() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main>
        <PageHero pageTitle="Account" 
          pageDescription="Manage your account settings and preferences" 
          backgroundImage="/pattern/upholstery.webp"
        />
        <AccountContainer />
      </main>
      <Footer />
    </div>
  );
}
