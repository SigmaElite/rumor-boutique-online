import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const otherMenuItems = [
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Возврат и обмен", href: "/returns" },
  { label: "Определение размера", href: "/size-guide" },
  { label: "Центр поддержки", href: "/support" },
  { label: "Контакты", href: "/contacts" },
  { label: "FAQ", href: "/faq" },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/20 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-background z-50 animate-slide-in-right shadow-xl overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 transition-opacity hover:opacity-60"
              aria-label="Закрыть меню"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1 px-6 py-2">
            <ul className="space-y-0">
              {/* Каталог с подкатегориями */}
              <li>
                <button
                  onClick={() => setCatalogOpen(!catalogOpen)}
                  className="flex items-center justify-between w-full py-3 text-sm font-medium tracking-wide uppercase hover:opacity-70 transition-opacity"
                >
                  <span>Каталог</span>
                  {catalogOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {catalogOpen && (
                  <ul className="pl-4 pb-2 space-y-0">
                    <li>
                      <Link
                        to="/catalog"
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                        onClick={onClose}
                      >
                        Все изделия
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category}>
                        <Link
                          to={`/catalog?category=${encodeURIComponent(category)}`}
                          className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
                          onClick={onClose}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* Остальные пункты меню */}
              {otherMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block py-3 text-sm font-medium tracking-wide uppercase hover:opacity-70 transition-opacity"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
