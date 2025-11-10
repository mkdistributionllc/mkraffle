import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main>
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
