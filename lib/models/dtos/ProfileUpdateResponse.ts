export interface ProfileUpdateResponse {
  message: string;
  roomsProcessed: number;
  totalProfilesUpdated: number;
  roomsWithUpdates: Array<{
    roomId: string;
    profilesUpdated: number;
  }>;
}

export interface ProfileUpdateRequestBody {
  roomId: string;
  entityId: string;
  method: UpdateProfileMethod;
  entityName?: string;
  profileUrl?: string;
}

export type UpdateProfileMethod = 'dndbeyond' | 'library';
