import { prisma } from "../prisma";

export const systemSettingService = {
  async getAll() {
    return prisma.systemSetting.findMany({ orderBy: { group: "asc" } });
  },

  async getByGroup(group: string) {
    return prisma.systemSetting.findMany({ where: { group }, orderBy: { key: "asc" } });
  },

  async getValue(key: string): Promise<string | null> {
    const setting = await prisma.systemSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  },

  async getNumericValue(key: string, defaultVal: number): Promise<number> {
    const val = await this.getValue(key);
    return val ? Number(val) : defaultVal;
  },

  async getBooleanValue(key: string, defaultVal: boolean): Promise<boolean> {
    const val = await this.getValue(key);
    return val ? val === "true" : defaultVal;
  },

  async upsert(data: { key: string; value: string; type?: string; label: string; description?: string; group?: string }) {
    return prisma.systemSetting.upsert({
      where: { key: data.key },
      update: { value: data.value, type: data.type, label: data.label, description: data.description, group: data.group },
      create: data,
    });
  },

  async updateValue(id: string, value: string) {
    return prisma.systemSetting.update({ where: { id }, data: { value } });
  },

  async remove(id: string) {
    return prisma.systemSetting.delete({ where: { id } });
  },
};
