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
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("Seed completed: feature flags & system settings");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
