// ============================================
// GS SPORT - Language / i18n Provider
// Supports: English (en), Georgian (ka), Russian (ru)
// ============================================

'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'ka' | 'ru';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    home: 'Home',
    shop: 'Shop',
    men: 'Men',
    women: 'Women',
    accessories: 'Accessories',
    shoes: 'Shoes',
    about: 'About',
    // Header
    search: 'Search',
    my_account: 'My Account',
    sign_in: 'Sign In',
    wishlist: 'Wishlist',
    admin_panel: 'Admin Panel',
    search_placeholder: 'What are you looking for?',
    // Hero
    shop_now: 'Shop Now',
    // Categories
    shop_by_category: 'Shop by Category',
    find_your_fit: 'Find your perfect fit',
    // Products
    quick_add: 'Quick Add',
    best_seller: 'Best Seller',
    add_to_cart: 'Add to Cart',
    // Promo
    limited_offer: 'Limited Time Offer',
    shop_sale: 'Shop Sale',
    // Newsletter
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    enter_email: 'Enter your email',
    subscribe_agree: 'By subscribing, you agree to our Privacy Policy.',
    // Footer
    help: 'Help',
    company: 'Company',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    contact_us: 'Contact Us',
    shipping_returns: 'Shipping & Returns',
    size_guide: 'Size Guide',
    faq: 'FAQ',
    track_order: 'Track Order',
    about_us: 'About Us',
    careers: 'Careers',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    new_arrivals: 'New Arrivals',
    sale: 'Sale',
    // Chat
    start_conversation: 'Start a conversation',
    team_reply: 'Our team typically replies within a few minutes',
    start_chat: 'Start Chat',
    your_name: 'Your name',
    type_message: 'Type a message...',
    chat_unavailable: 'Chat is temporarily unavailable. Please try again later.',
    // Account
    my_orders: 'My Orders',
    sign_out: 'Sign Out',
    edit_profile: 'Edit Profile',
    // Product Detail
    back_to_shop: 'Back to shop',
    description: 'Description',
    reviews: 'Reviews',
    // Auth
    sign_in_account: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    forgot_password: 'Forgot password?',
    no_account: "Don't have an account?",
    create_account: 'Create an Account',
    or: 'or',
    continue_google: 'Continue with Google',
    // Welcome
    welcome_to: 'Welcome to GS Sport',
    click_enter: 'Click anywhere to enter',
    loading: 'Loading',
  },
  ka: {
    // Nav
    home: 'მთავარი',
    shop: 'მაღაზია',
    men: 'კაცი',
    women: 'ქალი',
    accessories: 'აქსესუარები',
    shoes: 'ფეხსაცმელი',
    about: 'ჩვენს შესახებ',
    // Header
    search: 'ძებნა',
    my_account: 'ჩემი ანგარიში',
    sign_in: 'შესვლა',
    wishlist: 'სურვილები',
    admin_panel: 'ადმინ პანელი',
    search_placeholder: 'რას ეძებთ?',
    // Hero
    shop_now: 'იყიდე ახლა',
    // Categories
    shop_by_category: 'კატეგორიის მიხედვით',
    find_your_fit: 'იპოვე შენი სტილი',
    // Products
    quick_add: 'დამატება',
    best_seller: 'ბესტსელერი',
    add_to_cart: 'კალათაში დამატება',
    // Promo
    limited_offer: 'შეზღუდული დროით',
    shop_sale: 'ფასდაკლება',
    // Newsletter
    subscribe: 'გამოწერა',
    subscribing: 'იწერება...',
    enter_email: 'შეიყვანეთ ელ-ფოსტა',
    subscribe_agree: 'გამოწერით თქვენ ეთანხმებით კონფიდენციალურობის პოლიტიკას.',
    // Footer
    help: 'დახმარება',
    company: 'კომპანია',
    privacy: 'კონფიდენციალურობა',
    terms: 'პირობები',
    cookies: 'ქუქი-ფაილები',
    contact_us: 'კონტაქტი',
    shipping_returns: 'მიწოდება და დაბრუნება',
    size_guide: 'ზომების ცხრილი',
    faq: 'FAQ',
    track_order: 'შეკვეთის თვალყურის დევნება',
    about_us: 'ჩვენს შესახებ',
    careers: 'კარიერა',
    privacy_policy: 'კონფიდენციალურობის პოლიტიკა',
    terms_of_service: 'მომსახურების პირობები',
    new_arrivals: 'ახალი',
    sale: 'ფასდაკლება',
    // Chat
    start_conversation: 'დაიწყეთ საუბარი',
    team_reply: 'ჩვენი გუნდი პასუხობს რამდენიმე წუთში',
    start_chat: 'ჩატის დაწყება',
    your_name: 'თქვენი სახელი',
    type_message: 'დაწერეთ შეტყობინება...',
    chat_unavailable: 'ჩატი დროებით მიუწვდომელია. სცადეთ მოგვიანებით.',
    // Account
    my_orders: 'ჩემი შეკვეთები',
    sign_out: 'გასვლა',
    edit_profile: 'პროფილის რედაქტირება',
    // Product Detail
    back_to_shop: 'მაღაზიაში დაბრუნება',
    description: 'აღწერა',
    reviews: 'შეფასებები',
    // Auth
    sign_in_account: 'შედით თქვენს ანგარიშში',
    email: 'ელ-ფოსტა',
    password: 'პაროლი',
    forgot_password: 'დაგავიწყდათ პაროლი?',
    no_account: 'არ გაქვთ ანგარიში?',
    create_account: 'ანგარიშის შექმნა',
    or: 'ან',
    continue_google: 'Google-ით გაგრძელება',
    // Welcome
    welcome_to: 'კეთილი იყოს თქვენი მობრძანება GS Sport-ში',
    click_enter: 'დააჭირეთ სადმე შესასვლელად',
    loading: 'იტვირთება',
  },
  ru: {
    // Nav
    home: 'Главная',
    shop: 'Магазин',
    men: 'Мужчины',
    women: 'Женщины',
    accessories: 'Аксессуары',
    shoes: 'Обувь',
    about: 'О нас',
    // Header
    search: 'Поиск',
    my_account: 'Мой аккаунт',
    sign_in: 'Войти',
    wishlist: 'Избранное',
    admin_panel: 'Панель админа',
    search_placeholder: 'Что вы ищете?',
    // Hero
    shop_now: 'Купить сейчас',
    // Categories
    shop_by_category: 'Категории',
    find_your_fit: 'Найди свой стиль',
    // Products
    quick_add: 'Добавить',
    best_seller: 'Бестселлер',
    add_to_cart: 'В корзину',
    // Promo
    limited_offer: 'Ограниченное предложение',
    shop_sale: 'Распродажа',
    // Newsletter
    subscribe: 'Подписаться',
    subscribing: 'Подписка...',
    enter_email: 'Введите email',
    subscribe_agree: 'Подписываясь, вы соглашаетесь с политикой конфиденциальности.',
    // Footer
    help: 'Помощь',
    company: 'Компания',
    privacy: 'Конфиденциальность',
    terms: 'Условия',
    cookies: 'Куки',
    contact_us: 'Контакты',
    shipping_returns: 'Доставка и возврат',
    size_guide: 'Таблица размеров',
    faq: 'FAQ',
    track_order: 'Отследить заказ',
    about_us: 'О нас',
    careers: 'Карьера',
    privacy_policy: 'Политика конфиденциальности',
    terms_of_service: 'Условия использования',
    new_arrivals: 'Новинки',
    sale: 'Распродажа',
    // Chat
    start_conversation: 'Начать разговор',
    team_reply: 'Наша команда обычно отвечает в течение нескольких минут',
    start_chat: 'Начать чат',
    your_name: 'Ваше имя',
    type_message: 'Введите сообщение...',
    chat_unavailable: 'Чат временно недоступен. Попробуйте позже.',
    // Account
    my_orders: 'Мои заказы',
    sign_out: 'Выйти',
    edit_profile: 'Редактировать профиль',
    // Product Detail
    back_to_shop: 'Вернуться в магазин',
    description: 'Описание',
    reviews: 'Отзывы',
    // Auth
    sign_in_account: 'Войдите в аккаунт',
    email: 'Эл. почта',
    password: 'Пароль',
    forgot_password: 'Забыли пароль?',
    no_account: 'Нет аккаунта?',
    create_account: 'Создать аккаунт',
    or: 'или',
    continue_google: 'Продолжить с Google',
    // Welcome
    welcome_to: 'Добро пожаловать в GS Sport',
    click_enter: 'Нажмите куда-нибудь чтобы войти',
    loading: 'Загрузка',
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gs_lang') as Lang;
      if (saved && translations[saved]) {
        setLangState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('gs_lang', newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => translations[lang][key] || translations.en[key] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Language selector component
export function LanguageSelector({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const flags: Record<Lang, string> = {
    en: '🇬🇧',
    ka: '🇬🇪',
    ru: '🇷🇺',
  };

  const labels: Record<Lang, string> = {
    en: 'EN',
    ka: 'GE',
    ru: 'RU',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {(Object.keys(flags) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded transition-all duration-200 font-medium tracking-wider ${
            lang === l
              ? 'bg-black text-white'
              : 'text-neutral-400 hover:text-black'
          }`}
          aria-label={`Switch to ${labels[l]}`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
