// ============================================
// GS SPORT - Language / i18n Provider
// Supports: English (en), Georgian (ka), Russian (ru)
// ============================================

'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

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
    size_label: 'Size',
    color_label: 'Color',
    quantity_label: 'Quantity',
    out_of_stock: 'Out of Stock',
    only_left: 'Only {count} left in stock',
    product_not_found: 'Product not found',
    write_comment: 'Please write a comment',
    review_submitted: 'Review submitted!',
    review_deleted: 'Review deleted',
    // Auth
    sign_in_account: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    forgot_password: 'Forgot password?',
    no_account: "Don't have an account?",
    create_account: 'Create an Account',
    or: 'or',
    continue_google: 'Continue with Google',
    create_your_account: 'Create your account',
    already_have_account: 'Already have an account?',
    full_name: 'Full Name',
    confirm_password: 'Confirm Password',
    welcome_back: 'Welcome back!',
    account_created_verify: 'Account created! Please check your email to verify.',
    auth_invalid_credentials: 'Invalid email or password. If you signed up recently, please verify your email first.',
    auth_check_email_verification: 'Please verify your email before logging in.',
    auth_unexpected_error: 'Unexpected auth error. Please try again.',
    signed_out: 'Signed out',
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
    pay: 'Pay',
    place_order: 'Place Order',
    order_summary: 'Order Summary',
    shipping_label: 'Shipping',
    free: 'Free',
    tax: 'Tax',
    total: 'Total',
    processing_order: 'Processing...',
    delivery_days: 'Delivery: 3-6 business days',
    free_shipping_threshold: 'Free shipping on orders over ₾55',
    shipping_fee_notice: '₾5 shipping fee for orders under ₾55',
    pay_when_receive: 'Pay with cash when your order arrives',
    secure_bank_payment: 'Secure payment via Bank of Georgia',
    performance_tagline: 'Performance · Minimalism · Power',
    // Contact page
    contact_title: 'Contact Us',
    contact_intro: "Have a question or need help? We'd love to hear from you.",
    name: 'Name',
    message: 'Message',
    how_can_help: 'How can we help?',
    send_message: 'Send Message',
    working_hours: 'Working Hours',
    // FAQ details
    faq_q1: 'How long does shipping take?',
    faq_a1: 'Standard shipping takes 3-7 business days. Express delivery is available for 1-3 business days at an additional cost.',
    faq_q2: 'What is your return policy?',
    faq_a2: 'We accept returns within 30 days of purchase. Items must be unworn, unwashed, and in original condition with tags attached.',
    faq_q3: 'Do you offer international shipping?',
    faq_a3: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.',
    faq_q4: 'How can I track my order?',
    faq_a4: "Once your order ships, you'll receive a confirmation email with a tracking number. You can also check your order status in your account.",
    faq_q5: 'What payment methods do you accept?',
    faq_a5: 'We accept all major credit/debit cards (Visa, Mastercard, American Express) through BOG iPay (Bank of Georgia).',
    faq_q6: 'How do I find my size?',
    faq_a6: "Check our Size Guide page for detailed measurements. If you're between sizes, we recommend going up one size.",
    faq_q7: 'Can I change or cancel my order?',
    faq_a7: 'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed.',
    faq_q8: 'Do you have a physical store?',
    faq_a8: 'We are primarily an online store based in Tbilisi, Georgia. Follow our social media for pop-up event announcements.',
    // Shop page
    all_products: 'All Products',
    products_label: 'products',
    loading_short: 'Loading...',
    show_filters: 'Show Filters',
    hide_filters: 'Hide Filters',
    sort_by: 'Sort by:',
    newest: 'Newest',
    price_low_high: 'Price: Low to High',
    price_high_low: 'Price: High to Low',
    name_a_z: 'Name: A to Z',
    categories: 'Categories',
    all: 'All',
    price_range: 'Price Range',
    clear_filters: 'Clear filters',
    apply_filters: 'Apply Filters',
    no_products_found: 'No products found',
    try_adjusting_filters: 'Try adjusting your filters or search query',
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
    size_label: 'ზომა',
    color_label: 'ფერი',
    quantity_label: 'რაოდენობა',
    out_of_stock: 'არ არის მარაგში',
    only_left: 'მარაგშია მხოლოდ {count}',
    product_not_found: 'პროდუქტი ვერ მოიძებნა',
    write_comment: 'გთხოვთ დაწეროთ კომენტარი',
    review_submitted: 'შეფასება გაიგზავნა!',
    review_deleted: 'შეფასება წაიშალა',
    // Auth
    sign_in_account: 'შედით თქვენს ანგარიშში',
    email: 'ელ-ფოსტა',
    password: 'პაროლი',
    forgot_password: 'დაგავიწყდათ პაროლი?',
    no_account: 'არ გაქვთ ანგარიში?',
    create_account: 'ანგარიშის შექმნა',
    or: 'ან',
    continue_google: 'Google-ით გაგრძელება',
    create_your_account: 'ანგარიშის შექმნა',
    already_have_account: 'უკვე გაქვთ ანგარიში?',
    full_name: 'სრული სახელი',
    confirm_password: 'დაადასტურეთ პაროლი',
    welcome_back: 'კეთილი დაბრუნება!',
    account_created_verify: 'ანგარიში შეიქმნა! გთხოვთ, გადაამოწმოთ ელ-ფოსტა.',
    auth_invalid_credentials: 'ელ-ფოსტა ან პაროლი არასწორია. თუ ახლახან დარეგისტრირდით, ჯერ ელ-ფოსტა დაადასტურეთ.',
    auth_check_email_verification: 'გთხოვთ, შესვლამდე ელ-ფოსტა დაადასტუროთ.',
    auth_unexpected_error: 'ავტორიზაციის შეცდომა. სცადეთ თავიდან.',
    signed_out: 'თქვენ გამოხვედით ანგარიშიდან',
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
    pay: 'გადახდა',
    place_order: 'შეკვეთის განთავსება',
    order_summary: 'შეკვეთის შეჯამება',
    shipping_label: 'მიწოდება',
    free: 'უფასო',
    tax: 'გადასახადი',
    total: 'სულ',
    processing_order: 'მუშავდება...',
    delivery_days: 'მიწოდება: 3-6 სამუშაო დღე',
    free_shipping_threshold: 'უფასო მიწოდება ₾55-ზე მეტ შეკვეთებზე',
    shipping_fee_notice: '₾5 მიწოდების საფასური ₾55-ზე ნაკლებ შეკვეთებზე',
    pay_when_receive: 'გადაიხადეთ ნაღდი ანგარისწორებით მიღებისას',
    secure_bank_payment: 'უსაფრთხო გადახდა საქართველოს ბანკის მეშვეობით',
    performance_tagline: 'შესრულება · მინიმალიზმი · ძალა',
    // Contact page
    contact_title: 'კონტაქტი',
    contact_intro: 'გაქვთ კითხვა ან გჭირდებათ დახმარება? სიამოვნებით მოგისმენთ.',
    name: 'სახელი',
    message: 'შეტყობინება',
    how_can_help: 'რით შეგვიძლია დაგეხმაროთ?',
    send_message: 'შეტყობინების გაგზავნა',
    working_hours: 'სამუშაო საათები',
    // FAQ details
    faq_q1: 'რამდენ ხანს გრძელდება მიწოდება?',
    faq_a1: 'სტანდარტული მიწოდება გრძელდება 3-7 სამუშაო დღე. ექსპრეს მიწოდება ხელმისაწვდომია 1-3 სამუშაო დღეში დამატებითი საფასურით.',
    faq_q2: 'როგორია დაბრუნების პოლიტიკა?',
    faq_a2: 'დაბრუნება მიიღება შეძენიდან 30 დღის განმავლობაში. ნივთი უნდა იყოს გამოუყენებელი და საწყის მდგომარეობაში, ეტიკეტებით.',
    faq_q3: 'საერთაშორისო მიწოდება გაქვთ?',
    faq_a3: 'დიახ, ვაწვდით მსოფლიოს უმეტეს ქვეყნებში. ტარიფი და ვადები დამოკიდებულია მიმართულებაზე.',
    faq_q4: 'როგორ ვაკონტროლო შეკვეთა?',
    faq_a4: 'გაგზავნის შემდეგ მიიღებთ ელ-ფოსტას tracking ნომრით. ასევე შეგიძლიათ სტატუსის ნახვა თქვენს ანგარიშში.',
    faq_q5: 'რომელ გადახდის მეთოდებს იღებთ?',
    faq_a5: 'ვიღებთ მთავარ საბანკო ბარათებს (Visa, Mastercard, American Express) BOG iPay-ის მეშვეობით.',
    faq_q6: 'როგორ ვიპოვო ჩემი ზომა?',
    faq_a6: 'გადადით ზომების ცხრილში დეტალური მონაცემებისთვის. თუ ორ ზომას შორის ხართ, ავიღეთ ერთი ზომით მაღლა.',
    faq_q7: 'შეკვეთის შეცვლა ან გაუქმება შეიძლება?',
    faq_a7: 'შეკვეთა შეიძლება შეიცვალოს ან გაუქმდეს განთავსებიდან 1 საათში. შემდეგ ის გადადის დამუშავებაში.',
    faq_q8: 'ფიზიკური მაღაზია გაქვთ?',
    faq_a8: 'ძირითადად ონლაინ მაღაზია ვართ თბილისში. Pop-up ღონისძიებების შესახებ სოციალურ ქსელებში ვაქვეყნებთ.',
    // Shop page
    all_products: 'ყველა პროდუქტი',
    products_label: 'პროდუქტი',
    loading_short: 'იტვირთება...',
    show_filters: 'ფილტრების ჩვენება',
    hide_filters: 'ფილტრების დამალვა',
    sort_by: 'დალაგება:',
    newest: 'ახალი',
    price_low_high: 'ფასი: დაბლიდან მაღლა',
    price_high_low: 'ფასი: მაღლიდან დაბლა',
    name_a_z: 'სახელი: A-დან Z-მდე',
    categories: 'კატეგორიები',
    all: 'ყველა',
    price_range: 'ფასის დიაპაზონი',
    clear_filters: 'ფილტრების გასუფთავება',
    apply_filters: 'ფილტრების გამოყენება',
    no_products_found: 'პროდუქტი ვერ მოიძებნა',
    try_adjusting_filters: 'სცადეთ ფილტრების ან ძებნის შეცვლა',
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
    size_label: 'Размер',
    color_label: 'Цвет',
    quantity_label: 'Количество',
    out_of_stock: 'Нет в наличии',
    only_left: 'Осталось только {count}',
    product_not_found: 'Товар не найден',
    write_comment: 'Пожалуйста, напишите комментарий',
    review_submitted: 'Отзыв отправлен!',
    review_deleted: 'Отзыв удалён',
    // Auth
    sign_in_account: 'Войдите в аккаунт',
    email: 'Эл. почта',
    password: 'Пароль',
    forgot_password: 'Забыли пароль?',
    no_account: 'Нет аккаунта?',
    create_account: 'Создать аккаунт',
    or: 'или',
    continue_google: 'Продолжить с Google',
    create_your_account: 'Создайте аккаунт',
    already_have_account: 'Уже есть аккаунт?',
    full_name: 'Полное имя',
    confirm_password: 'Подтвердите пароль',
    welcome_back: 'С возвращением!',
    account_created_verify: 'Аккаунт создан! Пожалуйста, подтвердите email.',
    auth_invalid_credentials: 'Неверный email или пароль. Если вы недавно зарегистрировались, сначала подтвердите email.',
    auth_check_email_verification: 'Пожалуйста, подтвердите email перед входом.',
    auth_unexpected_error: 'Ошибка авторизации. Попробуйте еще раз.',
    signed_out: 'Вы вышли из аккаунта',
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
    pay: 'Оплатить',
    place_order: 'Оформить заказ',
    order_summary: 'Сводка заказа',
    shipping_label: 'Доставка',
    free: 'Бесплатно',
    tax: 'Налог',
    total: 'Итого',
    processing_order: 'Обработка...',
    delivery_days: 'Доставка: 3-6 рабочих дней',
    free_shipping_threshold: 'Бесплатная доставка при заказе от ₾55',
    shipping_fee_notice: 'Стоимость доставки ₾5 при заказе менее ₾55',
    pay_when_receive: 'Оплатите наличными при получении',
    secure_bank_payment: 'Безопасная оплата через Банк Грузии',
    performance_tagline: 'Производительность · Минимализм · Сила',
    // Contact page
    contact_title: 'Свяжитесь с нами',
    contact_intro: 'Есть вопрос или нужна помощь? Мы будем рады помочь.',
    name: 'Имя',
    message: 'Сообщение',
    how_can_help: 'Чем мы можем помочь?',
    send_message: 'Отправить сообщение',
    working_hours: 'Часы работы',
    // FAQ details
    faq_q1: 'Сколько занимает доставка?',
    faq_a1: 'Стандартная доставка занимает 3-7 рабочих дней. Экспресс-доставка доступна за 1-3 рабочих дня за дополнительную плату.',
    faq_q2: 'Какая у вас политика возврата?',
    faq_a2: 'Мы принимаем возвраты в течение 30 дней после покупки. Товар должен быть не ношеным и в оригинальном состоянии с бирками.',
    faq_q3: 'Есть ли международная доставка?',
    faq_a3: 'Да, мы доставляем в большинство стран мира. Стоимость и сроки зависят от направления.',
    faq_q4: 'Как отследить заказ?',
    faq_a4: 'После отправки вы получите email с трек-номером. Также статус доступен в вашем аккаунте.',
    faq_q5: 'Какие способы оплаты принимаете?',
    faq_a5: 'Мы принимаем основные кредитные и дебетовые карты через BOG iPay (Bank of Georgia).',
    faq_q6: 'Как подобрать размер?',
    faq_a6: 'Смотрите страницу Size Guide с подробными измерениями. Если вы между размерами, рекомендуем взять на размер больше.',
    faq_q7: 'Можно изменить или отменить заказ?',
    faq_a7: 'Заказ можно изменить или отменить в течение 1 часа после оформления. После этого он уходит в обработку.',
    faq_q8: 'У вас есть офлайн-магазин?',
    faq_a8: 'Мы в основном онлайн-магазин в Тбилиси, Грузия. Следите за соцсетями для анонсов pop-up событий.',
    // Shop page
    all_products: 'Все товары',
    products_label: 'товаров',
    loading_short: 'Загрузка...',
    show_filters: 'Показать фильтры',
    hide_filters: 'Скрыть фильтры',
    sort_by: 'Сортировать:',
    newest: 'Сначала новые',
    price_low_high: 'Цена: по возрастанию',
    price_high_low: 'Цена: по убыванию',
    name_a_z: 'Название: A-Z',
    categories: 'Категории',
    all: 'Все',
    price_range: 'Диапазон цен',
    clear_filters: 'Сбросить фильтры',
    apply_filters: 'Применить фильтры',
    no_products_found: 'Товары не найдены',
    try_adjusting_filters: 'Попробуйте изменить фильтры или запрос поиска',
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const labels: Record<Lang, string> = {
    en: 'EN',
    ka: 'GE',
    ru: 'RU',
  };

  return (
    <div ref={rootRef} className={`relative z-[80] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 h-7 px-2 rounded bg-neutral-900/80 hover:bg-neutral-800 text-white text-[10px] sm:text-xs tracking-wider"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language menu"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {labels[lang]}
        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 7l5 5 5-5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-24 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg" role="menu">
          {(Object.keys(labels) as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-xs tracking-wider font-medium transition-colors ${
                lang === l ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100 hover:text-black'
              }`}
              role="menuitem"
              aria-label={`Switch to ${labels[l]}`}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
