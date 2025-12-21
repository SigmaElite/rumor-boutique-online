import { Link } from "react-router-dom";
import { categories } from "@/data/products";

interface CatalogDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

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
          <div>
            <h3 className="font-semibold text-sm tracking-wide mb-4">Каталог</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/catalog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={onClose}
                >
                  Все изделия
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/catalog?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogDropdown;
