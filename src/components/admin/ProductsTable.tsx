import { DbProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Star, Sparkles, Percent } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProductsTableProps {
  products: DbProduct[];
  onEdit: (product: DbProduct) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const ProductsTable = ({ products, onEdit, onDelete, loading }: ProductsTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Загрузка товаров...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Товары не найдены</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Фото</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Метки</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    Нет
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div>
                  <span className="font-medium">{product.price} BYN</span>
                  {product.old_price && (
                    <span className="text-muted-foreground line-through ml-2 text-sm">
                      {product.old_price} BYN
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.is_new && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                      <Sparkles className="h-3 w-3" />
                      NEW
                    </span>
                  )}
                  {product.is_bestseller && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded text-xs">
                      <Star className="h-3 w-3" />
                      Best
                    </span>
                  )}
                  {product.is_sale && (
                    <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 px-2 py-0.5 rounded text-xs">
                      <Percent className="h-3 w-3" />
                      Sale
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить "{product.name}"? Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(product.id)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
