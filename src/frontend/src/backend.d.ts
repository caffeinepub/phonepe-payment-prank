import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Notification {
    id: bigint;
    recipient: string;
    audioData?: ExternalBlob;
    isRead: boolean;
    sender: string;
    message: MessageType;
    timestamp: Time;
}
export type MessageType = {
    __kind__: "text";
    text: string;
};
export interface UserProfile {
    name: string;
    language: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllNotifications(): Promise<Array<Notification>>;
    getAllUsers(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserNotifications(userId: string): Promise<Array<Notification>>;
    getUserProfile(user: string): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    registerUser(name: string, language: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendAudioNotification(recipientId: string, message: string, audioData: ExternalBlob): Promise<void>;
    sendTextNotification(recipientId: string, message: string): Promise<void>;
}
