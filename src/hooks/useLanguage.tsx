// ============================================
// GS SPORT - Language / i18n Provider
// Supports: English (en), Georgian (ka), Russian (ru)
// ============================================

'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'ka' | 'ru';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Topbar
    topbar_free_shipping: 'Free Shipping on Orders Over ₾100',
    topbar_new_arrivals: 'New Arrivals Just Dropped',
    topbar_premium_athletic: 'Premium Athletic Wear',
    topbar_easy_returns: 'Easy Returns & Exchanges',
    topbar_signup_discount: 'Sign Up & Get 10% Off',
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
    hero_headline: 'Elevate Your Game',
    hero_subheadline: 'Premium athletic wear designed for those who demand excellence.',
    hero_cta: 'Shop Now',
    // Categories
    shop_by_category: 'Shop by Category',
    find_your_fit: 'Find your perfect fit',
    category_men: 'Men',
    category_women: 'Women',
    category_accessories: 'Accessories',
    category_shoes: 'Shoes',
    // Products
    quick_add: 'Quick Add',
    best_seller: 'Best Seller',
    add_to_cart: 'Add to Cart',
    featured_title: 'Featured Collection',
    featured_subtitle: 'Curated pieces for the modern athlete',
    bestseller_title: 'Best Sellers',
    bestseller_subtitle: 'Our most loved products',
    // Promo
    limited_offer: 'Limited Time Offer',
    shop_sale: 'Shop Sale',
    promo_title: 'New Season, New Goals',
    promo_subtitle: 'Up to 40% off on selected items',
    // Newsletter
    newsletter_title: 'Join the GS SPORT Family',
    newsletter_subtitle: 'Subscribe and get 10% off your first order',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    enter_email: 'Enter your email',
    subscribe_agree: 'By subscribing, you agree to our Privacy Policy.',
    subscribed_success: 'Thank you for subscribing!',
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
    footer_about: 'GS SPORT is a premium athletic brand dedicated to empowering athletes with high-quality, stylish performance wear.',
    footer_copyright: 'All rights reserved.',
    // Chat
    start_conversation: 'Start a conversation',
    team_reply: 'Our team typically replies within a few minutes',
    start_chat: 'Start Chat',
    your_name: 'Your name',
    type_message: 'Type a message...',
    chat_unavailable: 'Chat is temporarily unavailable. Please try again later.',
    chat_session_expired: 'Chat session expired. Please start a new chat.',
    live_chat_support: 'Live Chat Support',
    // Account
    my_orders: 'My Orders',
    sign_out: 'Sign Out',
    edit_profile: 'Edit Profile',
    orders: 'Orders',
    addresses: 'Addresses',
    reviews_label: 'Reviews',
    track_manage_orders: 'Track and manage your orders',
    saved_products: 'Your saved products',
    update_your_info: 'Update your information',
    save: 'Save',
    cancel: 'Cancel',
    welcome: 'Welcome',
    admin: 'Admin',
    recent_orders: 'Recent Orders',
    view_all: 'View All',
    no_orders: 'No orders yet',
    start_shopping: 'Start Shopping',
    manage_your_store: 'Manage your store',
    manage_addresses: 'Manage your addresses',
    add_address: 'Add Address',
    address_name: 'Address Name',
    address_line: 'Address',
    city: 'City',
    no_addresses: 'No saved addresses',
    add_first_address: 'Add your first delivery address',
    delete_address: 'Delete',
    default_address: 'Default',
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
    // Cart
    cart: 'Cart',
    cart_empty: 'Your cart is empty',
    continue_shopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    shipping_taxes_checkout: 'Shipping and taxes calculated at checkout',
    checkout: 'Checkout',
    // Wishlist
    wishlist_count: '{count} items',
    wishlist_empty: 'Your wishlist is empty',
    browse_products: 'Browse Products',
    // About
    about_not_available: 'About page content is not available.',
    our_story: 'Our Story',
    // FAQ
    faq_intro: 'Find answers to the most common questions below.',
    faq_still_questions: 'Still have questions?',
    faq_help: 'Contact our support team for help.',
    // Welcome
    welcome_to: 'Welcome to GS Sport',
    click_enter: 'Click anywhere to enter',
    loading: 'Loading',
    // Checkout
    checkout_title: 'Checkout',
    cart_empty_checkout: 'Your cart is empty',
    shipping_info: 'Shipping Information',
    first_name: 'First Name',
    last_name: 'Last Name',
    address: 'Address',
    state: 'State / Region',
    zip: 'ZIP Code',
    country: 'Country',
    phone: 'Phone',
    payment_method: 'Payment Method',
    cash_on_delivery: 'Cash on Delivery',
    card_payment: 'Card Payment',
    place_order: 'Place Order',
    order_summary: 'Order Summary',
    shipping_label: 'Shipping',
    free: 'Free',
    tax: 'Tax',
    total: 'Total',
    processing_order: 'Processing...',
    performance_tagline: 'Performance · Minimalism · Power',
  },
  ka: {
    // Topbar
    topbar_free_shipping: 'უფასო მიწოდება ₾100-ზე მეტ შეკვეთაზე',
    topbar_new_arrivals: 'ახალი კოლექცია უკვე ხელმისაწვდომია',
    topbar_premium_athletic: 'პრემიუმ სპორტული ტანსაცმელი',
    topbar_easy_returns: 'მარტივი დაბრუნება და გაცვლა',
    topbar_signup_discount: 'დარეგისტრირდი და მიიღე 10% ფასდაკლება',
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
    hero_headline: 'აიმაღლე შენი თამაში',
    hero_subheadline: 'პრემიუმ სპორტული ტანსაცმელი მათთვის, ვინც ბრწყინვალებას მოითხოვს.',
    hero_cta: 'იყიდე ახლა',
    // Categories
    shop_by_category: 'კატეგორიის მიხედვით',
    find_your_fit: 'იპოვე შენი სტილი',
    category_men: 'კაცი',
    category_women: 'ქალი',
    category_accessories: 'აქსესუარები',
    category_shoes: 'ფეხსაცმელი',
    // Products
    quick_add: 'დამატება',
    best_seller: 'ბესტსელერი',
    add_to_cart: 'კალათაში დამატება',
    featured_title: 'გამორჩეული კოლექცია',
    featured_subtitle: 'შერჩეული ნაწარმი თანამედროვე სპორტსმენისთვის',
    bestseller_title: 'ბესტსელერები',
    bestseller_subtitle: 'ჩვენი ყველაზე მოთხოვნადი პროდუქტები',
    // Promo
    limited_offer: 'შეზღუდული დროით',
    shop_sale: 'ფასდაკლება',
    promo_title: 'ახალი სეზონი, ახალი მიზნები',
    promo_subtitle: '40%-მდე ფასდაკლება შერჩეულ პროდუქტებზე',
    // Newsletter
    newsletter_title: 'შემოუერთდი GS SPORT-ის ოჯახს',
    newsletter_subtitle: 'გამოიწერე და მიიღე 10% ფასდაკლება პირველ შეკვეთაზე',
    subscribe: 'გამოწერა',
    subscribing: 'იწერება...',
    enter_email: 'შეიყვანეთ ელ-ფოსტა',
    subscribe_agree: 'გამოწერით თქვენ ეთანხმებით კონფიდენციალურობის პოლიტიკას.',
    subscribed_success: 'გმადლობთ გამოწერისთვის!',
    // Footer
    help: 'დახმარება',
    company: 'კომპანია',
    privacy: 'კონფიდენციალურობა',
    terms: 'პირობები',
    cookies: 'ქუქი-ფაილები',
    contact_us: 'კონტაქტი',
    shipping_returns: 'მიწოდება და დაბრუნება',
    size_guide: 'ზომების ცხრილი',
    faq: 'ხ.დ.კ.',
    track_order: 'შეკვეთის თვალყურის დევნება',
    about_us: 'ჩვენს შესახებ',
    careers: 'კარიერა',
    privacy_policy: 'კონფიდენციალურობის პოლიტიკა',
    terms_of_service: 'მომსახურების პირობები',
    new_arrivals: 'ახალი',
    sale: 'ფასდაკლება',
    footer_about: 'GS SPORT არის პრემიუმ სპორტული ბრენდი, რომელიც ეძღვნება სპორტსმენების გაძლიერებას მაღალხარისხიანი, სტილური სპორტული ტანსაცმლით.',
    footer_copyright: 'ყველა უფლება დაცულია.',
    // Chat
    start_conversation: 'დაიწყეთ საუბარი',
    team_reply: 'ჩვენი გუნდი პასუხობს რამდენიმე წუთში',
    start_chat: 'ჩატის დაწყება',
    your_name: 'თქვენი სახელი',
    type_message: 'დაწერეთ შეტყობინება...',
    chat_unavailable: 'ჩატი დროებით მიუწვდომელია. სცადეთ მოგვიანებით.',
    chat_session_expired: 'ჩატის სესია ამოიწურა. დაიწყეთ ახალი ჩატი.',
    live_chat_support: 'პირდაპირი ჩატი',
    // Account
    my_orders: 'ჩემი შეკვეთები',
    sign_out: 'გასვლა',
    edit_profile: 'პროფილის რედაქტირება',
    orders: 'შეკვეთები',
    addresses: 'მისამართები',
    reviews_label: 'შეფასებები',
    track_manage_orders: 'შეკვეთების მართვა',
    saved_products: 'შენახული პროდუქტები',
    update_your_info: 'განაახლე შენი ინფორმაცია',
    save: 'შენახვა',
    cancel: 'გაუქმება',
    welcome: 'მოგესალმებით',
    admin: 'ადმინი',
    recent_orders: 'ბოლო შეკვეთები',
    view_all: 'ყველას ნახვა',
    no_orders: 'შეკვეთები ჯერ არ არის',
    start_shopping: 'შოპინგის დაწყება',
    manage_your_store: 'მართე შენი მაღაზია',
    manage_addresses: 'მისამართების მართვა',
    add_address: 'მისამართის დამატება',
    address_name: 'მისამართის სახელი',
    address_line: 'მისამართი',
    city: 'ქალაქი',
    no_addresses: 'შენახული მისამართები არ არის',
    add_first_address: 'დაამატე პირველი მიწოდების მისამართი',
    delete_address: 'წაშლა',
    default_address: 'ძირითადი',
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
    // Cart
    cart: 'კალათა',
    cart_empty: 'თქვენი კალათა ცარიელია',
    continue_shopping: 'შოპინგის გაგრძელება',
    subtotal: 'ჯამი',
    shipping_taxes_checkout: 'მიწოდება და გადასახადი გამოითვლება გადახდისას',
    checkout: 'გადახდა',
    // Wishlist
    wishlist_count: '{count} ნივთი',
    wishlist_empty: 'სურვილების სია ცარიელია',
    browse_products: 'პროდუქტების ნახვა',
    // About
    about_not_available: 'ჩვენს შესახებ გვერდის ინფორმაცია მიუწვდომელია.',
    our_story: 'ჩვენი ისტორია',
    // FAQ
    faq_intro: 'იპოვეთ პასუხები ყველაზე გავრცელებულ კითხვებზე ქვემოთ.',
    faq_still_questions: 'ჯერ კიდევ გაქვთ კითხვები?',
    faq_help: 'დაუკავშირდით ჩვენს მხარდაჭერის გუნდს.',
    // Welcome
    welcome_to: 'კეთილი იყოს თქვენი მობრძანება GS Sport-ში',
    click_enter: 'დააჭირეთ სადმე შესასვლელად',
    loading: 'იტვირთება',
    // Checkout
    checkout_title: 'შეკვეთის გაფორმება',
    cart_empty_checkout: 'თქვენი კალათა ცარიელია',
    shipping_info: 'მიწოდების ინფორმაცია',
    first_name: 'სახელი',
    last_name: 'გვარი',
    address: 'მისამართი',
    state: 'რეგიონი',
    zip: 'საფოსტო ინდექსი',
    country: 'ქვეყანა',
    phone: 'ტელეფონი',
    payment_method: 'გადახდის მეთოდი',
    cash_on_delivery: 'ნაღდი ანგარისწორება',
    card_payment: 'ბარათით გადახდა',
    place_order: 'შეკვეთის განთავსება',
    order_summary: 'შეკვეთის შეჯამება',
    shipping_label: 'მიწოდება',
    free: 'უფასო',
    tax: 'გადასახადი',
    total: 'სულ',
    processing_order: 'მუშავდება...',
    performance_tagline: 'წარმადობა · მინიმალიზმი · ძალა',
  },
  ru: {
    // Topbar
    topbar_free_shipping: 'Бесплатная доставка при заказе от ₾100',
    topbar_new_arrivals: 'Новые поступления уже в магазине',
    topbar_premium_athletic: 'Премиум спортивная одежда',
    topbar_easy_returns: 'Простой возврат и обмен',
    topbar_signup_discount: 'Зарегистрируйтесь и получите скидку 10%',
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
    hero_headline: 'Подними свою игру',
    hero_subheadline: 'Премиальная спортивная одежда для тех, кто требует лучшего.',
    hero_cta: 'Купить сейчас',
    // Categories
    shop_by_category: 'Категории',
    find_your_fit: 'Найди свой стиль',
    category_men: 'Мужчины',
    category_women: 'Женщины',
    category_accessories: 'Аксессуары',
    category_shoes: 'Обувь',
    // Products
    quick_add: 'Добавить',
    best_seller: 'Бестселлер',
    add_to_cart: 'В корзину',
    featured_title: 'Избранная коллекция',
    featured_subtitle: 'Лучшие вещи для современного атлета',
    bestseller_title: 'Бестселлеры',
    bestseller_subtitle: 'Наши самые популярные товары',
    // Promo
    limited_offer: 'Ограниченное предложение',
    shop_sale: 'Распродажа',
    promo_title: 'Новый сезон, новые цели',
    promo_subtitle: 'Скидки до 40% на избранные товары',
    // Newsletter
    newsletter_title: 'Присоединяйтесь к семье GS SPORT',
    newsletter_subtitle: 'Подпишитесь и получите скидку 10% на первый заказ',
    subscribe: 'Подписаться',
    subscribing: 'Подписка...',
    enter_email: 'Введите email',
    subscribe_agree: 'Подписываясь, вы соглашаетесь с политикой конфиденциальности.',
    subscribed_success: 'Спасибо за подписку!',
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
    footer_about: 'GS SPORT — премиальный спортивный бренд, посвящённый созданию высококачественной и стильной спортивной одежды.',
    footer_copyright: 'Все права защищены.',
    // Chat
    start_conversation: 'Начать разговор',
    team_reply: 'Наша команда обычно отвечает в течение нескольких минут',
    start_chat: 'Начать чат',
    your_name: 'Ваше имя',
    type_message: 'Введите сообщение...',
    chat_unavailable: 'Чат временно недоступен. Попробуйте позже.',
    chat_session_expired: 'Сессия чата истекла. Начните новый чат.',
    live_chat_support: 'Чат поддержки',
    // Account
    my_orders: 'Мои заказы',
    sign_out: 'Выйти',
    edit_profile: 'Редактировать профиль',
    orders: 'Заказы',
    addresses: 'Адреса',
    reviews_label: 'Отзывы',
    track_manage_orders: 'Отслеживайте и управляйте заказами',
    saved_products: 'Сохранённые товары',
    update_your_info: 'Обновите свою информацию',
    save: 'Сохранить',
    cancel: 'Отмена',
    welcome: 'Добро пожаловать',
    admin: 'Админ',
    recent_orders: 'Последние заказы',
    view_all: 'Все',
    no_orders: 'Заказов пока нет',
    start_shopping: 'Начать покупки',
    manage_your_store: 'Управление магазином',
    manage_addresses: 'Управление адресами',
    add_address: 'Добавить адрес',
    address_name: 'Название адреса',
    address_line: 'Адрес',
    city: 'Город',
    no_addresses: 'Сохранённых адресов нет',
    add_first_address: 'Добавьте первый адрес доставки',
    delete_address: 'Удалить',
    default_address: 'Основной',
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
    // Cart
    cart: 'Корзина',
    cart_empty: 'Ваша корзина пуста',
    continue_shopping: 'Продолжить покупки',
    subtotal: 'Итого',
    shipping_taxes_checkout: 'Стоимость доставки и налоги рассчитываются при оформлении',
    checkout: 'Оформить заказ',
    // Wishlist
    wishlist_count: '{count} товаров',
    wishlist_empty: 'Ваш список избранного пуст',
    browse_products: 'Просмотреть товары',
    // About
    about_not_available: 'Информация о нас недоступна.',
    our_story: 'Наша история',
    // FAQ
    faq_intro: 'Ответы на часто задаваемые вопросы.',
    faq_still_questions: 'Остались вопросы?',
    faq_help: 'Свяжитесь с нашей службой поддержки.',
    // Welcome
    welcome_to: 'Добро пожаловать в GS Sport',
    click_enter: 'Нажмите куда-нибудь чтобы войти',
    loading: 'Загрузка',
    // Checkout
    checkout_title: 'Оформление заказа',
    cart_empty_checkout: 'Ваша корзина пуста',
    shipping_info: 'Информация о доставке',
    first_name: 'Имя',
    last_name: 'Фамилия',
    address: 'Адрес',
    state: 'Область / Регион',
    zip: 'Почтовый индекс',
    country: 'Страна',
    phone: 'Телефон',
    payment_method: 'Способ оплаты',
    cash_on_delivery: 'Оплата наличными',
    card_payment: 'Оплата картой',
    place_order: 'Оформить заказ',
    order_summary: 'Сводка заказа',
    shipping_label: 'Доставка',
    free: 'Бесплатно',
    tax: 'Налог',
    total: 'Итого',
    processing_order: 'Обработка...',
    performance_tagline: 'Производительность · Минимализм · Сила',
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
