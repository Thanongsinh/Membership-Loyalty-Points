import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Default Feature Flags
  const flags = [
    { key: "registration", name: "User Registration", description: "Allow new users to register", enabled: true },
    { key: "redeem_rewards", name: "Reward Redemption", description: "Allow members to redeem rewards", enabled: true },
    { key: "earn_points", name: "Points Earning", description: "Allow earning points", enabled: true },
    { key: "campaigns", name: "Campaigns", description: "Enable campaign system", enabled: true },
    { key: "notifications", name: "Notifications", description: "Enable notification system", enabled: true },
    { key: "maintenance_mode", name: "Maintenance Mode", description: "Put system in maintenance mode", enabled: false },
    { key: "gamification", name: "Gamification", description: "Enable daily check-in and badges", enabled: true },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  // Default System Settings
  const settings = [
    { key: "tier_silver", value: "1000", type: "number", label: "Silver Tier Threshold", group: "tiers" },
    { key: "tier_gold", value: "5000", type: "number", label: "Gold Tier Threshold", group: "tiers" },
    { key: "tier_platinum", value: "20000", type: "number", label: "Platinum Tier Threshold", group: "tiers" },
    { key: "points_expiry_days", value: "365", type: "number", label: "Points Expiry (days)", description: "0 = no expiry", group: "points" },
    { key: "max_points_per_transaction", value: "10000", type: "number", label: "Max Points per Transaction", group: "points" },
    { key: "default_points_multiplier", value: "1", type: "number", label: "Default Points Multiplier", group: "points" },
    { key: "app_name", value: "Loyalty Points", type: "string", label: "Application Name", group: "general" },
    { key: "support_email", value: "support@example.com", type: "string", label: "Support Email", group: "general" },
    { key: "referral_referrer_bonus", value: "200", type: "number", label: "Referrer Bonus Points", description: "Points given to the person who refers", group: "referral" },
    { key: "referral_referred_bonus", value: "100", type: "number", label: "Referred Bonus Points", description: "Points given to the new member", group: "referral" },
    { key: "daily_checkin_points", value: "10", type: "number", label: "Daily Check-in Points", description: "Points earned per daily check-in", group: "gamification" },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  // Sample Product Categories
  const categories = [
    { name: "Electronics", description: "Electronic devices and accessories" },
    { name: "Fashion", description: "Clothing and accessories" },
    { name: "Food & Beverage", description: "Food, drinks, and snacks" },
    { name: "Health & Beauty", description: "Health and beauty products" },
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { id: `seed-${cat.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: { id: `seed-${cat.name.toLowerCase().replace(/\s+/g, "-")}`, ...cat },
    });
  }

  // Sample Stores
  const stores = [
    { name: "Main Branch", description: "Flagship store in the city center", address: "123 Main St", phone: "02-123-4567", openingHours: "Mon-Sun 9:00-21:00" },
    { name: "North Branch", description: "Convenient location in the north", address: "456 North Rd", phone: "02-234-5678", openingHours: "Mon-Sun 10:00-20:00" },
  ];

  for (const store of stores) {
    await prisma.store.upsert({
      where: { id: `seed-${store.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: { id: `seed-${store.name.toLowerCase().replace(/\s+/g, "-")}`, ...store },
    });
  }

  // Add store feature flag
  await prisma.featureFlag.upsert({
    where: { key: "store_system" },
    update: {},
    create: { key: "store_system", name: "Store System", description: "Enable store & product system", enabled: true },
  });

  // Low stock threshold setting
  await prisma.systemSetting.upsert({
    where: { key: "low_stock_threshold" },
    update: {},
    create: { key: "low_stock_threshold", value: "5", type: "number", label: "Low Stock Alert Threshold", description: "Alert when product stock falls below this", group: "store" },
  });

  // Sample Promotions
  const promos = [
    { code: "WELCOME10", name: "Welcome 10%", type: "PERCENTAGE" as const, value: 10, maxUses: 100, startDate: new Date(), endDate: new Date(Date.now() + 365 * 86400000) },
    { code: "FLAT50", name: "Flat 50 Off", type: "FIXED" as const, value: 50, minOrderAmount: 200, maxUses: 50, startDate: new Date(), endDate: new Date(Date.now() + 180 * 86400000) },
    { code: "BONUS100", name: "100 Bonus Points", type: "BONUS_POINTS" as const, value: 100, maxUses: 0, startDate: new Date(), endDate: new Date(Date.now() + 90 * 86400000) },
  ];

  for (const promo of promos) {
    await prisma.promotion.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
  }

  // Promotion feature flag
  await prisma.featureFlag.upsert({
    where: { key: "promotions" },
    update: {},
    create: { key: "promotions", name: "Promotions", description: "Enable promotion/coupon system", enabled: true },
  });

  console.log("Seed completed: feature flags, system settings, categories, stores & promotions");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
