import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import CatalogDropdown from "./CatalogDropdown";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { totalFavorites, setIsFavoritesOpen } = useFavorites();

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
          {/* Left - Catalog Button */}
          <div className="flex-1 md:w-[200px] md:flex-none">
            <button
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm tracking-wide hover:opacity-90 transition-opacity"
            >
              {isCatalogOpen ? (
                <X className="w-4 h-4" strokeWidth={2} />
              ) : (
                <Menu className="w-4 h-4" strokeWidth={2} />
              )}
              Каталог
            </button>
            <a href="/" className="md:hidden">
              <h1 className="font-display text-2xl tracking-[0.3em] uppercase font-medium">
                Rumor
              </h1>
            </a>
          </div>

          {/* Center - Logo (desktop only) */}
          <div className="hidden md:flex justify-center">
            <a href="/">
              <h1 className="font-display text-3xl tracking-[0.3em] uppercase font-medium">
                Rumor
              </h1>
            </a>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-1 md:gap-6 flex-1 md:w-[200px] md:flex-none justify-end">
            <button className="p-1.5 md:p-2 transition-opacity hover:opacity-60" aria-label="Поиск">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => setIsFavoritesOpen(true)}
              className="p-1.5 md:p-2 transition-opacity hover:opacity-60 relative" 
              aria-label="Избранное"
            >
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {totalFavorites > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
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

        {/* Catalog Dropdown */}
        <CatalogDropdown isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
