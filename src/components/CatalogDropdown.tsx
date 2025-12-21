import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface CatalogDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const catalogCategories = [
  { label: "Все изделия", href: "/catalog" },
  { label: "Платья", href: "/catalog?category=dresses" },
  { label: "Корсеты", href: "/catalog?category=corsets" },
  { label: "Жакеты", href: "/catalog?category=jackets" },
  { label: "Брюки • шорты", href: "/catalog?category=pants" },
];

const catalogCategories2 = [
  { label: "Блузы • топы", href: "/catalog?category=tops" },
  { label: "Юбки", href: "/catalog?category=skirts" },
  { label: "Боди", href: "/catalog?category=bodysuits" },
  { label: "Костюмы", href: "/catalog?category=suits" },
];

const collections = [
  { label: "SANTA BABY", href: "/catalog?collection=santa-baby" },
  { label: "ROUGE AFFAIR", href: "/catalog?collection=rouge-affair" },
];

const CatalogDropdown = ({ isOpen, onClose }: CatalogDropdownProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/10 z-30"
        onClick={onClose}
      />
      
      {/* Dropdown Panel */}
      <div className="absolute top-full left-0 right-0 bg-background border-b border-border z-40 animate-fade-in">
        <div className="container py-10">
          <div className="flex gap-24">
            {/* Каталог Column */}
            <div>
              <h3 className="font-semibold text-sm tracking-wide mb-4">Каталог</h3>
              <div className="flex gap-16">
                <ul className="space-y-2">
                  {catalogCategories.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {catalogCategories2.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Коллекции Column */}
            <div>
              <h3 className="font-semibold text-sm tracking-wide mb-4">Коллекции</h3>
              <ul className="space-y-2">
                {collections.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogDropdown;
