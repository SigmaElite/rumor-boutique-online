import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="container flex items-center justify-between h-20">
          {/* Left - Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 transition-opacity hover:opacity-60"
            aria-label="Открыть меню"
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Center - Logo */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-display text-2xl md:text-3xl tracking-[0.3em] uppercase font-medium">
              Rumor
            </h1>
          </a>

          {/* Right - Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="p-2 transition-opacity hover:opacity-60" aria-label="Поиск">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 transition-opacity hover:opacity-60 hidden md:block" aria-label="Избранное">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="p-2 -mr-2 transition-opacity hover:opacity-60" aria-label="Корзина">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
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
