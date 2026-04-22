import { prisma } from '../config/database.js';
import type { ProfileUpdateInput } from '../types/index.js';

export class ProfileService {
  async get(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        businessType: true,
        role: true,
        companyName: true,
        gstNumber: true,
        address: true,
        state: true,
        city: true,
        pincode: true,
        primaryContact: true,
        alternateContact: true,
        bankName: true,
        accountNumber: true,
        ifscCode: true,
        logoUrl: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async update(userId: string, data: ProfileUpdateInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        businessType: true,
        role: true,
        companyName: true,
        gstNumber: true,
        address: true,
        state: true,
        city: true,
        pincode: true,
        primaryContact: true,
        alternateContact: true,
        bankName: true,
        accountNumber: true,
        ifscCode: true,
        logoUrl: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updatePhoto(userId: string, photoUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photoUrl },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePhoto: true,
      },
    });

    return user;
  }
}

export const profileService = new ProfileService();