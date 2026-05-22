export const GOVERNORATES = [
  { id: 'all', en: 'All Iraq', ar: 'كل العراق', ku: 'هەموو عێراق' },
  { id: 'baghdad', en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' },
  { id: 'basra', en: 'Basra', ar: 'البصرة', ku: 'بەسرە' },
  { id: 'nineveh', en: 'Nineveh', ar: 'نينوى', ku: 'نەینەوا' },
  { id: 'erbil', en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' },
  { id: 'sulaymaniyah', en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' },
  { id: 'kirkuk', en: 'Kirkuk', ar: 'كركوك', ku: 'كەركووك' },
  { id: 'najaf', en: 'Najaf', ar: 'النجف', ku: 'نەجەف' },
  { id: 'karbala', en: 'Karbala', ar: 'كربلاء', ku: 'كەربەلا' },
  { id: 'babil', en: 'Babil', ar: 'بابل', ku: 'بابل' },
  { id: 'anbar', en: 'Anbar', ar: 'الأنبار', ku: 'ئەنبار' },
  { id: 'diyala', en: 'Diyala', ar: 'ديالى', ku: 'دیالە' },
  { id: 'dhi_qar', en: 'Dhi Qar', ar: 'ذي قار', ku: 'زیقار' },
  { id: 'maysan', en: 'Maysan', ar: 'ميسان', ku: 'میسان' },
  { id: 'al_qadisiyah', en: 'Al-Qadisiyah', ar: 'القادسية', ku: 'قادسیە' },
  { id: 'wasit', en: 'Wasit', ar: 'واسط', ku: 'واست' },
  { id: 'muthanna', en: 'Al-Muthanna', ar: 'المثنى', ku: 'موسەنا' },
  { id: 'dohuk', en: 'Dohuk', ar: 'دهوك', ku: 'دهۆك' },
  { id: 'salah_al_din', en: 'Salah Al-Din', ar: 'صلاح الدين', ku: 'سەلاحەدین' },
  { id: 'halabja', en: 'Halabja', ar: 'حلبجة', ku: 'هەڵەبجە' },
];

export const CATEGORIES = [
  { id: 'health', en: 'Health', ar: 'الصحة', ku: 'تەندروستی', icon: 'Stethoscope', image: 'https://picsum.photos/seed/health/400/300' },
  { id: 'dining', en: 'Dining', ar: 'مطاعم', ku: 'خواردنگە', icon: 'Utensils', image: 'https://picsum.photos/seed/food/400/300' },
  { id: 'cafe', en: 'Cafe', ar: 'كافيهات', ku: 'کافێ', icon: 'Coffee', image: 'https://picsum.photos/seed/coffee/400/300' },
  { id: 'hotels', en: 'Hotels', ar: 'فنادق', ku: 'وتێل', icon: 'Hotel', image: 'https://picsum.photos/seed/hotel/400/300' },
  { id: 'hospitals', en: 'Hospitals', ar: 'مستشفيات', ku: 'نەخۆشخانە', icon: 'Hospital', image: 'https://picsum.photos/seed/hospital/400/300' },
  { id: 'lawyers', en: 'Lawyers', ar: 'محامون', ku: 'پارێزەران', icon: 'Gavel', image: 'https://picsum.photos/seed/law/400/300' },
  { id: 'gym', en: 'Gym', ar: 'صالات رياضية', ku: 'جیم', icon: 'Dumbbell', image: 'https://picsum.photos/seed/gym/400/300' },
  { id: 'pharmacy', en: 'Pharmacy', ar: 'صيدليات', ku: 'دەرمانخانە', icon: 'Pills', image: 'https://picsum.photos/seed/pharm/400/300' },
  { id: 'shopping', en: 'Shopping', ar: 'تسوق', ku: 'بازاڕی', icon: 'ShoppingBag', image: 'https://picsum.photos/seed/shop/400/300' },
  { id: 'general', en: 'General', ar: 'عام', ku: 'گشتی', icon: 'Briefcase', image: 'https://picsum.photos/seed/general/400/300' },
  { id: 'banks', en: 'Banks', ar: 'بنوك', ku: 'بانکەکان', icon: 'Banknote', image: 'https://picsum.photos/seed/bank/400/300' },
  { id: 'education', en: 'Education', ar: 'تعليم', ku: 'خوێندن', icon: 'GraduationCap', image: 'https://picsum.photos/seed/edu/400/300' },
  { id: 'entertainment', en: 'Entertainment', ar: 'ترفيه', ku: 'کاتبەسەربردن', icon: 'PartyPopper', image: 'https://picsum.photos/seed/party/400/300' },
  { id: 'tourism', en: 'Tourism', ar: 'سياحة', ku: 'گەشتیاری', icon: 'Plane', image: 'https://picsum.photos/seed/travel/400/300' },
  { id: 'doctors', en: 'Doctors', ar: 'أطباء', ku: 'پزیشکەکان', icon: 'UserRound', image: 'https://picsum.photos/seed/doctor/400/300' },
  { id: 'realestate', en: 'Real Estate', ar: 'عقارات', ku: 'بەڵێندەرایەتی', icon: 'Home', image: 'https://picsum.photos/seed/estate/400/300' },
  { id: 'events', en: 'Events', ar: 'مناسبات', ku: 'بۆنەکان', icon: 'Calendar', image: 'https://picsum.photos/seed/event/400/300' },
  { id: 'beauty', en: 'Beauty', ar: 'تجميل', ku: 'جوانی', icon: 'Sparkles', image: 'https://picsum.photos/seed/beauty/400/300' },
  { id: 'supermarkets', en: 'Supermarkets', ar: 'سوبر ماركت', ku: 'سۆپەرمارکێت', icon: 'ShoppingBasket', image: 'https://picsum.photos/seed/market/400/300' },
  { id: 'furniture', en: 'Furniture', ar: 'أثاث', ku: 'مۆبیلیات', icon: 'Armchair', image: 'https://picsum.photos/seed/furniture/400/300' },
];


export const CITIES: Record<string, { id: string; en: string; ar: string; ku: string }[]> = {
  baghdad: [
    { id: 'mansour', en: 'Mansour', ar: 'المنصور', ku: 'مەنسوور' },
    { id: 'karrada', en: 'Karrada', ar: 'الكرادة', ku: 'که‌ڕادە' },
    { id: 'jadriya', en: 'Jadriya', ar: 'الجادرية', ku: 'جادریە' },
  ],
  erbil: [
    { id: 'bakhtiari', en: 'Bakhtiari', ar: 'بختياري', ku: 'بەختیاری' },
    { id: 'ankawa', en: 'Ankawa', ar: 'عنكاوا', ku: 'عەنکاوە' },
  ],
  basra: [
    { id: 'ashar', en: 'Ashar', ar: 'العشار', ku: 'ئەشار' },
    { id: 'zubeir', en: 'Zubeir', ar: 'الزبير', ku: 'زوبەیر' },
  ],
};

