export interface ProfileUpdateResponse {
  message: string;
  roomsProcessed: number;
  totalProfilesUpdated: number;
  roomsWithUpdates: Array<{
    roomId: string;
    profilesUpdated: number;
  }>;
}
