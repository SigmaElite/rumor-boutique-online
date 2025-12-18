import { Search, Heart, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5">
        <span className="text-xs tracking-[0.2em] uppercase font-body">
          Доставка по всему миру
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container flex items-center h-20">
          {/* Left - Logo (mobile) / Empty space (desktop) */}
          <div className="flex-1 md:flex-none">
            <a href="/" className="md:hidden">
              <h1 className="font-display text-2xl tracking-[0.3em] uppercase font-medium">
                Rumor
              </h1>
            </a>
          </div>

          {/* Center - Logo (desktop only) */}
          <div className="hidden md:flex flex-1 justify-center">
            <a href="/">
              <h1 className="font-display text-3xl tracking-[0.3em] uppercase font-medium">
                Rumor
              </h1>
            </a>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-1 md:gap-6 flex-1 md:flex-none justify-end">
            <button className="p-1.5 md:p-2 transition-opacity hover:opacity-60" aria-label="Поиск">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="p-1.5 md:p-2 transition-opacity hover:opacity-60" aria-label="Избранное">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 md:p-2 transition-opacity hover:opacity-60 relative" 
              aria-label="Корзина"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1.5 md:p-2 -mr-1 md:-mr-2 transition-opacity hover:opacity-60"
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
