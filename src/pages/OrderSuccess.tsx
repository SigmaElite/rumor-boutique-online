import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = (location.state as { orderId?: string })?.orderId;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
          
          <h1 className="font-script text-4xl mb-4">спасибо за заказ!</h1>
          
          {orderId && (
            <p className="text-muted-foreground mb-2">
              Номер заказа: <span className="font-medium text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
          
          <p className="text-muted-foreground mb-8">
            Мы свяжемся с вами в ближайшее время для подтверждения заказа
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button variant="outline">Продолжить покупки</Button>
            </Link>
            <Link to="/">
              <Button>На главную</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;