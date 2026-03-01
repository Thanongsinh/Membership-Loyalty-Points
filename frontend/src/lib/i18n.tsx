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
