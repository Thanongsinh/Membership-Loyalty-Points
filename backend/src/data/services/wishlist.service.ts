import { wishlistRepository } from "../repositories/wishlist.repository";

export const wishlistService = {
  async getByMember(memberId: string) {
    return wishlistRepository.findByMember(memberId);
  },

  async toggle(memberId: string, productId: string) {
    const existing = await wishlistRepository.findOne(memberId, productId);
    if (existing) {
      await wishlistRepository.delete(memberId, productId);
      return { added: false };
    }
    await wishlistRepository.create(memberId, productId);
    return { added: true };
  },

  async remove(memberId: string, productId: string) {
    await wishlistRepository.delete(memberId, productId);
  },
};
