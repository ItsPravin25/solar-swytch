import { User } from '../models/user.model.js';
import type { ProfileUpdateInput } from '../types/index.js';

export class ProfileService {
  async get(userId: string) {
    return User.findById(userId).select('-password').lean();
  }

  async update(userId: string, data: ProfileUpdateInput) {
    return User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password').lean();
  }

  async updatePhoto(userId: string, photoUrl: string) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { profilePhoto: photoUrl } },
      { new: true }
    ).select('id email fullName profilePhoto').lean();
  }
}

export const profileService = new ProfileService();
