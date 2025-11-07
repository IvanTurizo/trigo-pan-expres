import { useState } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/bakery/Header";
import { Hero } from "@/components/bakery/Hero";
import { Products } from "@/components/bakery/Products";
import { Cart } from "@/components/bakery/Cart";
import { About } from "@/components/bakery/About";
import { Contact } from "@/components/bakery/Contact";
import { Footer } from "@/components/bakery/Footer";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main>
          <Hero />
          <Products />
          <About />
          <Contact />
        </main>
        <Footer />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
};

export default Index;
