import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ChevronDown, ChevronUp, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_method: string;
  payment_method: string;
  status: string;
  total_price: number;
  comment: string | null;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  color: string | null;
  size: string | null;
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Ожидает', variant: 'outline' },
  paid: { label: 'Оплачен', variant: 'default' },
  processing: { label: 'В обработке', variant: 'secondary' },
  shipped: { label: 'Отправлен', variant: 'secondary' },
  delivered: { label: 'Доставлен', variant: 'default' },
  cancelled: { label: 'Отменён', variant: 'destructive' },
  payment_failed: { label: 'Ошибка оплаты', variant: 'destructive' },
};

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: !sortDesc });

    if (error) {
      toast.error('Ошибка загрузки заказов');
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [sortDesc]);

  const fetchOrderItems = async (orderId: string) => {
    setItemsLoading(true);
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      toast.error('Ошибка загрузки товаров заказа');
    } else {
      setOrderItems(data || []);
    }
    setItemsLoading(false);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast.error('Ошибка обновления статуса');
    } else {
      toast.success('Статус обновлён');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery) ||
      o.id.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatus = (status: string) => statusMap[status] || { label: status, variant: 'outline' as const };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, email, телефону, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Найдено: {filtered.length} заказ(ов)
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Заказов не найдено</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                    onClick={() => setSortDesc(!sortDesc)}
                  >
                    Дата
                    {sortDesc ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                  </button>
                </TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const st = getStatus(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                    </TableCell>
                    <TableCell className="font-medium">{order.total_price} BYN</TableCell>
                    <TableCell>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Заказ #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Дата:</span>
                  <div>{format(new Date(selectedOrder.created_at), 'dd.MM.yyyy HH:mm')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Сумма:</span>
                  <div className="font-semibold">{selectedOrder.total_price} BYN</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Имя:</span>
                  <div>{selectedOrder.customer_name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div className="break-all">{selectedOrder.customer_email}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Телефон:</span>
                  <div>{selectedOrder.customer_phone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Доставка:</span>
                  <div>{selectedOrder.delivery_method === 'delivery' ? 'Доставка' : 'Самовывоз'}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Адрес:</span>
                  <div>{selectedOrder.delivery_address}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Оплата:</span>
                  <div>{selectedOrder.payment_method === 'cash' ? 'Наличные' : 'Карта (WebPay)'}</div>
                </div>
                {selectedOrder.comment && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Комментарий:</span>
                    <div>{selectedOrder.comment}</div>
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Статус:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) => handleStatusChange(selectedOrder.id, val)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Товары:</h4>
                {itemsLoading ? (
                  <div className="text-sm text-muted-foreground">Загрузка...</div>
                ) : orderItems.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Нет товаров</div>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start border rounded-md p-3 text-sm">
                        <div>
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {[item.color, item.size].filter(Boolean).join(' / ')}
                            {item.quantity > 1 && ` × ${item.quantity}`}
                          </div>
                        </div>
                        <div className="font-medium whitespace-nowrap">{item.product_price * item.quantity} BYN</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
