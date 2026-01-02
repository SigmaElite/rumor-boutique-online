import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const authSchema = z.object({
  email: z.string().email('Введите корректный email').max(255, 'Email слишком длинный'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов').max(72, 'Пароль слишком длинный'),
});

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const redirectTo = (location.state as { from?: string })?.from || '/';

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Ошибка',
              description: 'Неверный email или пароль',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Ошибка',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Успешно',
            description: 'Вы вошли в аккаунт',
          });
          navigate(redirectTo);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: 'Ошибка',
              description: 'Пользователь с таким email уже зарегистрирован',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Ошибка',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Успешно',
            description: 'Аккаунт создан! Теперь вы можете войти.',
          });
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-script text-4xl mb-2">
              {isLogin ? 'вход' : 'регистрация'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Войдите в аккаунт для оформления заказа' 
                : 'Создайте аккаунт для оформления заказа'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin 
                ? 'Нет аккаунта? Зарегистрируйтесь' 
                : 'Уже есть аккаунт? Войдите'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Вернуться на сайт
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserAuth;