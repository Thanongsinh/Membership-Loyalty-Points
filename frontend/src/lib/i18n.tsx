"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "la";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Common
    "app.name": "Loyalty Points",
    "app.admin": "Loyalty Admin",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    copy: "Copy",
    copied: "Copied!",
    search: "Search...",
    logout: "Logout",

    // Nav
    "nav.home": "Home",
    "nav.rewards": "Rewards",
    "nav.history": "History",
    "nav.referrals": "Referrals",
    "nav.checkin": "Check-in & Badges",
    "nav.profile": "Profile",
    "nav.overview": "Overview",
    "nav.members": "Members",
    "nav.points": "Points",
    "nav.transactions": "Transactions",
    "nav.campaigns": "Campaigns",
    "nav.featureFlags": "Feature Flags",
    "nav.settings": "Settings",
    "nav.auditLogs": "Audit Logs",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.totalMembers": "Total Members",
    "dashboard.pointsEarned": "Points Earned",
    "dashboard.pointsRedeemed": "Points Redeemed",
    "dashboard.transactions": "Transactions",
    "dashboard.pointsActivity": "Points Activity",
    "dashboard.tierDistribution": "Tier Distribution",
    "dashboard.exportMembers": "Members CSV",
    "dashboard.exportTransactions": "Transactions CSV",

    // Portal
    "portal.welcome": "Welcome",
    "portal.yourPoints": "Your Points",
    "portal.tierBadge": "Tier Badge",
    "portal.pointsTo": "points to",

    // Gamification
    "gamification.title": "Daily Check-in & Badges",
    "gamification.checkin": "Daily Check-in",
    "gamification.checkinDesc": "Check in daily to earn points! Every 7th day gets a bonus.",
    "gamification.checkinBtn": "Check In Today",
    "gamification.success": "Check-in successful!",
    "gamification.streak": "Streak",
    "gamification.days": "days",
    "gamification.pointsEarned": "Points earned",
    "gamification.streakBonus": "Streak bonus",
    "gamification.badges": "Badges",

    // Referrals
    "referral.title": "Referrals",
    "referral.yourCode": "Your Referral Code",
    "referral.shareDesc": "Share this code or QR with friends to earn bonus points!",
    "referral.useCode": "Use a Referral Code",
    "referral.useDesc": "Enter a code from a friend to earn bonus points.",
    "referral.apply": "Apply",
    "referral.yourReferrals": "Your Referrals",
    "referral.noReferrals": "No referrals yet. Share your code!",
    "referral.joined": "Joined",

    // Rewards
    "rewards.title": "Rewards",
    "rewards.redeem": "Redeem",
    "rewards.pts": "pts",
    "rewards.stock": "Stock",

    // Profile
    "profile.title": "Profile",
    "profile.firstName": "First Name",
    "profile.lastName": "Last Name",
    "profile.phone": "Phone",
    "profile.email": "Email",

    // Members
    "members.title": "Members",
    "members.name": "Name",
    "members.email": "Email",
    "members.tier": "Tier",
    "members.currentPoints": "Current Points",
    "members.totalPoints": "Total Points",
    "members.allTiers": "All Tiers",

    // Transactions
    "transactions.title": "Transactions",
    "transactions.date": "Date",
    "transactions.member": "Member",
    "transactions.type": "Type",
    "transactions.points": "Points",
    "transactions.description": "Description",
    "transactions.allTypes": "All Types",

    // Store System
    "nav.stores": "Stores",
    "nav.categories": "Categories",
    "nav.orders": "Orders",
    "nav.cart": "Cart",
    "store.title": "Stores",
    "store.browse": "Browse Stores",
    "store.add": "Add Store",
    "store.edit": "Edit",
    "store.name": "Name",
    "store.description": "Description",
    "store.address": "Address",
    "store.phone": "Phone",
    "store.status": "Status",
    "store.active": "Active",
    "store.inactive": "Inactive",
    "store.products": "Products",
    "store.staff": "Staff",
    "store.info": "Info",
    "store.orders": "Orders",
    "store.addProduct": "Add Product",
    "store.productName": "Product Name",
    "store.price": "Price",
    "store.pointsPrice": "Points Price",
    "store.stock": "Stock",
    "store.category": "Category",
    "store.assignStaff": "Assign Staff",
    "store.isManager": "Is Manager",
    "store.staffCount": "Staff Count",
    "store.orderNumber": "Order #",
    "store.member": "Member",
    "store.orderStatus": "Status",
    "store.payment": "Payment",
    "store.total": "Total",
    "store.date": "Date",
    "store.currency": "THB",
    "store.pts": "pts",
    "store.added": "Added!",
    "store.addToCart": "Add to Cart",
    "category.title": "Product Categories",
    "category.add": "Add Category",
    "category.edit": "Edit Category",
    "category.name": "Name",
    "order.title": "Orders",
    "order.allStores": "All Stores",
    "order.allStatuses": "All Statuses",
    "order.store": "Store",
    "order.myOrders": "My Orders",
    "order.noOrders": "No orders yet.",
    "cart.title": "Shopping Cart",
    "cart.clear": "Clear Cart",
    "cart.empty": "Your cart is empty.",
    "cart.quantity": "Quantity",
    "cart.summary": "Order Summary",
    "cart.checkout": "Checkout with Points",
    "cart.orderSuccess": "Order placed successfully!",
    "cart.viewOrders": "View My Orders",

    // Promotions
    "nav.promotions": "Promotions",
    "promo.title": "Promotions",
    "promo.add": "Add Promotion",
    "promo.edit": "Edit Promotion",
    "promo.code": "Promo Code",
    "promo.name": "Name",
    "promo.type": "Type",
    "promo.value": "Value",
    "promo.minOrder": "Min Order",
    "promo.maxUses": "Max Uses",
    "promo.usage": "Usage",
    "promo.period": "Period",
    "promo.startDate": "Start Date",
    "promo.endDate": "End Date",
    "promo.enterCode": "Enter promo code",
    "promo.apply": "Apply",
    "promo.store": "Store",
    "promo.allStores": "All Stores",
    "promo.active": "Active",
    "promo.expired": "Expired",

    // Wishlist
    "nav.wishlist": "Wishlist",
    "wishlist.title": "My Wishlist",
    "wishlist.empty": "Your wishlist is empty.",

    // Reviews
    "review.write": "Write a Review",
    "review.rating": "Rating",
    "review.comment": "Comment",
    "review.submit": "Submit Review",
    "review.reviews": "Reviews",
    "review.noReviews": "No reviews yet.",
    "review.stars": "stars",

    // Receipt
    "receipt.title": "Receipt",
    "receipt.print": "Print",
    "receipt.subtotal": "Subtotal",
    "receipt.discount": "Discount",
    "receipt.pointsUsed": "Points Used",
    "receipt.thanks": "Thank you for your purchase!",
    "receipt.receipt": "Receipt",

    // Staff
    "staff.title": "Staff Dashboard",
    "staff.dashboard": "Dashboard",
    "staff.orders": "Orders",
    "staff.pendingOrders": "Pending Orders",
    "staff.todayOrders": "Today's Orders",
    "staff.todayRevenue": "Today's Revenue",
    "staff.updateStatus": "Update Status",
    "staff.earnPoints": "Earn Points",
    "staff.memberId": "Member ID",
    "staff.amount": "Amount",
    "staff.description": "Description",

    // Analytics
    "analytics.storeAnalytics": "Store Analytics",
    "analytics.revenue": "Revenue",
    "analytics.topProducts": "Top Products",
    "analytics.dailySales": "Daily Sales",
    "analytics.completedOrders": "Completed Orders",
    "analytics.export": "Export CSV",
  },
  la: {
    // Common
    "app.name": "ລະບົບຄະແນນ",
    "app.admin": "ຜູ້ບໍລິຫານ",
    loading: "ກຳລັງໂຫລດ...",
    save: "ບັນທຶກ",
    cancel: "ຍົກເລີກ",
    copy: "ຄັດລອກ",
    copied: "ຄັດລອກແລ້ວ!",
    search: "ຄົ້ນຫາ...",
    logout: "ອອກຈາກລະບົບ",

    // Nav
    "nav.home": "ໜ້າຫຼັກ",
    "nav.rewards": "ລາງວັນ",
    "nav.history": "ປະຫວັດ",
    "nav.referrals": "ແນະນຳ",
    "nav.checkin": "ເຊັກອິນ & ຫຼຽນ",
    "nav.profile": "ໂປຣໄຟລ໌",
    "nav.overview": "ພາບລວມ",
    "nav.members": "ສະມາຊິກ",
    "nav.points": "ຄະແນນ",
    "nav.transactions": "ທຸລະກຳ",
    "nav.campaigns": "ແຄມເປນ",
    "nav.featureFlags": "ຟີເຈີ",
    "nav.settings": "ຕັ້ງຄ່າ",
    "nav.auditLogs": "ບັນທຶກ",

    // Dashboard
    "dashboard.title": "ແຜງຄວບຄຸມ",
    "dashboard.totalMembers": "ສະມາຊິກທັງໝົດ",
    "dashboard.pointsEarned": "ຄະແນນທີ່ໄດ້",
    "dashboard.pointsRedeemed": "ຄະແນນທີ່ໃຊ້",
    "dashboard.transactions": "ທຸລະກຳ",
    "dashboard.pointsActivity": "ກິດຈະກຳຄະແນນ",
    "dashboard.tierDistribution": "ການແຈກແຈງລະດັບ",
    "dashboard.exportMembers": "ສະມາຊິກ CSV",
    "dashboard.exportTransactions": "ທຸລະກຳ CSV",

    // Portal
    "portal.welcome": "ຍິນດີຕ້ອນຮັບ",
    "portal.yourPoints": "ຄະແນນຂອງທ່ານ",
    "portal.tierBadge": "ຫຼຽນລະດັບ",
    "portal.pointsTo": "ຄະແນນອີກ",

    // Gamification
    "gamification.title": "ເຊັກອິນປະຈຳວັນ & ຫຼຽນ",
    "gamification.checkin": "ເຊັກອິນປະຈຳວັນ",
    "gamification.checkinDesc": "ເຊັກອິນທຸກວັນເພື່ອຮັບຄະແນນ! ທຸກ 7 ວັນຈະໄດ້ໂບນັດ.",
    "gamification.checkinBtn": "ເຊັກອິນມື້ນີ້",
    "gamification.success": "ເຊັກອິນສຳເລັດ!",
    "gamification.streak": "ຕິດຕໍ່ກັນ",
    "gamification.days": "ວັນ",
    "gamification.pointsEarned": "ຄະແນນທີ່ໄດ້",
    "gamification.streakBonus": "ໂບນັດ",
    "gamification.badges": "ຫຼຽນ",

    // Referrals
    "referral.title": "ການແນະນຳ",
    "referral.yourCode": "ລະຫັດແນະນຳ",
    "referral.shareDesc": "ແບ່ງປັນລະຫັດ ຫຼື QR ກັບໝູ່ເພື່ອຮັບຄະແນນ!",
    "referral.useCode": "ໃຊ້ລະຫັດແນະນຳ",
    "referral.useDesc": "ປ້ອນລະຫັດຈາກໝູ່ເພື່ອຮັບຄະແນນ.",
    "referral.apply": "ນຳໃຊ້",
    "referral.yourReferrals": "ການແນະນຳຂອງທ່ານ",
    "referral.noReferrals": "ຍັງບໍ່ມີການແນະນຳ. ແບ່ງປັນລະຫັດ!",
    "referral.joined": "ເຂົ້າຮ່ວມ",

    // Rewards
    "rewards.title": "ລາງວັນ",
    "rewards.redeem": "ແລກ",
    "rewards.pts": "ຄະແນນ",
    "rewards.stock": "ຄັງ",

    // Profile
    "profile.title": "ໂປຣໄຟລ໌",
    "profile.firstName": "ຊື່",
    "profile.lastName": "ນາມສະກຸນ",
    "profile.phone": "ເບີໂທ",
    "profile.email": "ອີເມລ",

    // Members
    "members.title": "ສະມາຊິກ",
    "members.name": "ຊື່",
    "members.email": "ອີເມລ",
    "members.tier": "ລະດັບ",
    "members.currentPoints": "ຄະແນນປັດຈຸບັນ",
    "members.totalPoints": "ຄະແນນທັງໝົດ",
    "members.allTiers": "ທຸກລະດັບ",

    // Transactions
    "transactions.title": "ທຸລະກຳ",
    "transactions.date": "ວັນທີ",
    "transactions.member": "ສະມາຊິກ",
    "transactions.type": "ປະເພດ",
    "transactions.points": "ຄະແນນ",
    "transactions.description": "ລາຍລະອຽດ",
    "transactions.allTypes": "ທຸກປະເພດ",

    // Store System
    "nav.stores": "ຮ້ານຄ້າ",
    "nav.categories": "ໝວດໝູ່",
    "nav.orders": "ອໍເດີ",
    "nav.cart": "ກະຕ່າ",
    "store.title": "ຮ້ານຄ້າ",
    "store.browse": "ເລືອກຊື້ຮ້ານ",
    "store.add": "ເພີ່ມຮ້ານ",
    "store.edit": "ແກ້ໄຂ",
    "store.name": "ຊື່",
    "store.description": "ລາຍລະອຽດ",
    "store.address": "ທີ່ຢູ່",
    "store.phone": "ເບີໂທ",
    "store.status": "ສະຖານະ",
    "store.active": "ເປີດໃຊ້",
    "store.inactive": "ປິດ",
    "store.products": "ສິນຄ້າ",
    "store.staff": "ພະນັກງານ",
    "store.info": "ຂໍ້ມູນ",
    "store.orders": "ອໍເດີ",
    "store.addProduct": "ເພີ່ມສິນຄ້າ",
    "store.productName": "ຊື່ສິນຄ້າ",
    "store.price": "ລາຄາ",
    "store.pointsPrice": "ລາຄາຄະແນນ",
    "store.stock": "ຄັງ",
    "store.category": "ໝວດໝູ່",
    "store.assignStaff": "ເພີ່ມພະນັກງານ",
    "store.isManager": "ເປັນຜູ້ຈັດການ",
    "store.staffCount": "ຈຳນວນພະນັກງານ",
    "store.orderNumber": "ເລກອໍເດີ",
    "store.member": "ສະມາຊິກ",
    "store.orderStatus": "ສະຖານະ",
    "store.payment": "ການຊຳລະ",
    "store.total": "ລວມ",
    "store.date": "ວັນທີ",
    "store.currency": "ບາດ",
    "store.pts": "ຄະແນນ",
    "store.added": "ເພີ່ມແລ້ວ!",
    "store.addToCart": "ເພີ່ມໃສ່ກະຕ່າ",
    "category.title": "ໝວດໝູ່ສິນຄ້າ",
    "category.add": "ເພີ່ມໝວດໝູ່",
    "category.edit": "ແກ້ໄຂໝວດໝູ່",
    "category.name": "ຊື່",
    "order.title": "ອໍເດີ",
    "order.allStores": "ທຸກຮ້ານ",
    "order.allStatuses": "ທຸກສະຖານະ",
    "order.store": "ຮ້ານ",
    "order.myOrders": "ອໍເດີຂອງຂ້ອຍ",
    "order.noOrders": "ຍັງບໍ່ມີອໍເດີ.",
    "cart.title": "ກະຕ່າສິນຄ້າ",
    "cart.clear": "ລ້າງກະຕ່າ",
    "cart.empty": "ກະຕ່າຂອງທ່ານຫວ່າງຢູ່.",
    "cart.quantity": "ຈຳນວນ",
    "cart.summary": "ສະຫຼຸບອໍເດີ",
    "cart.checkout": "ຊຳລະດ້ວຍຄະແນນ",
    "cart.orderSuccess": "ສັ່ງອໍເດີສຳເລັດ!",
    "cart.viewOrders": "ເບິ່ງອໍເດີ",

    // Promotions
    "nav.promotions": "ໂປຣໂມຊັນ",
    "promo.title": "ໂປຣໂມຊັນ",
    "promo.add": "ເພີ່ມໂປຣໂມຊັນ",
    "promo.edit": "ແກ້ໄຂໂປຣໂມຊັນ",
    "promo.code": "ລະຫັດໂປຣໂມ",
    "promo.name": "ຊື່",
    "promo.type": "ປະເພດ",
    "promo.value": "ມູນຄ່າ",
    "promo.minOrder": "ອໍເດີຂັ້ນຕ່ຳ",
    "promo.maxUses": "ໃຊ້ໄດ້ສູງສຸດ",
    "promo.usage": "ການໃຊ້ງານ",
    "promo.period": "ໄລຍະເວລາ",
    "promo.startDate": "ວັນເລີ່ມ",
    "promo.endDate": "ວັນສິ້ນສຸດ",
    "promo.enterCode": "ປ້ອນລະຫັດໂປຣໂມ",
    "promo.apply": "ນຳໃຊ້",
    "promo.store": "ຮ້ານ",
    "promo.allStores": "ທຸກຮ້ານ",
    "promo.active": "ເປີດໃຊ້",
    "promo.expired": "ໝົດອາຍຸ",

    // Wishlist
    "nav.wishlist": "ລາຍການທີ່ມັກ",
    "wishlist.title": "ລາຍການທີ່ມັກ",
    "wishlist.empty": "ລາຍການທີ່ມັກຫວ່າງຢູ່.",

    // Reviews
    "review.write": "ຂຽນລີວິວ",
    "review.rating": "ຄະແນນ",
    "review.comment": "ຄຳເຫັນ",
    "review.submit": "ສົ່ງລີວິວ",
    "review.reviews": "ລີວິວ",
    "review.noReviews": "ຍັງບໍ່ມີລີວິວ.",
    "review.stars": "ດາວ",

    // Receipt
    "receipt.title": "ໃບຮັບເງິນ",
    "receipt.print": "ພິມ",
    "receipt.subtotal": "ລວມຍ່ອຍ",
    "receipt.discount": "ສ່ວນຫຼຸດ",
    "receipt.pointsUsed": "ຄະແນນທີ່ໃຊ້",
    "receipt.thanks": "ຂອບໃຈທີ່ໃຊ້ບໍລິການ!",
    "receipt.receipt": "ໃບຮັບເງິນ",

    // Staff
    "staff.title": "ແຜງພະນັກງານ",
    "staff.dashboard": "ແຜງຄວບຄຸມ",
    "staff.orders": "ອໍເດີ",
    "staff.pendingOrders": "ອໍເດີລໍຖ້າ",
    "staff.todayOrders": "ອໍເດີມື້ນີ້",
    "staff.todayRevenue": "ລາຍຮັບມື້ນີ້",
    "staff.updateStatus": "ອັບເດດສະຖານະ",
    "staff.earnPoints": "ເພີ່ມຄະແນນ",
    "staff.memberId": "ລະຫັດສະມາຊິກ",
    "staff.amount": "ຈຳນວນ",
    "staff.description": "ລາຍລະອຽດ",

    // Analytics
    "analytics.storeAnalytics": "ວິເຄາະຮ້ານ",
    "analytics.revenue": "ລາຍຮັບ",
    "analytics.topProducts": "ສິນຄ້າຂາຍດີ",
    "analytics.dailySales": "ຍອດຂາຍປະຈຳວັນ",
    "analytics.completedOrders": "ອໍເດີສຳເລັດ",
    "analytics.export": "ສົ່ງອອກ CSV",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("locale") as Locale) || "en";
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback((key: string) => {
    return translations[locale][key] || key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
