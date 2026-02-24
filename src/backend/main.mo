import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat64 "mo:core/Nat64";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

// Specify the data migration function in with-clause

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type MessageType = {
    #text : Text;
  };

  public type Notification = {
    id : Nat64;
    sender : Text;
    recipient : Text;
    message : MessageType;
    audioData : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    isRead : Bool;
  };

  public type UserProfile = {
    name : Text;
    language : Text;
  };

  var nextNotificationId : Nat = 1;
  let userProfiles = Map.empty<Text, UserProfile>();
  let userNotifications = Map.empty<Text, Set.Set<Nat64>>();
  let notificationsStore = Map.empty<Nat64, Notification>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller.toText());
  };

  public query ({ caller }) func getUserProfile(user : Text) : async ?UserProfile {
    if (caller.toText() != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller.toText(), profile);
    if (not userNotifications.containsKey(caller.toText())) {
      userNotifications.add(caller.toText(), Set.empty<Nat64>());
    };
  };

  public shared ({ caller }) func registerUser(name : Text, language : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    if (userProfiles.containsKey(caller.toText())) {
      Runtime.trap("User already registered");
    };
    let profile : UserProfile = { name; language };
    userProfiles.add(caller.toText(), profile);
    userNotifications.add(caller.toText(), Set.empty<Nat64>());
  };

  public shared ({ caller }) func sendTextNotification(recipientId : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send notifications");
    };

    if (not userProfiles.containsKey(caller.toText())) {
      Runtime.trap("Sender must be registered");
    };

    let id = Nat64.fromNat(nextNotificationId);
    let notification : Notification = {
      id;
      sender = caller.toText();
      recipient = recipientId;
      message = #text(message);
      audioData = null;
      timestamp = Time.now();
      isRead = false;
    };

    notificationsStore.add(id, notification);

    switch (userNotifications.get(recipientId)) {
      case (?recipientNotifications) {
        recipientNotifications.add(id);
      };
      case (null) {
        let newNotifications = Set.fromIter(Iter.singleton(id));
        userNotifications.add(recipientId, newNotifications);
      };
    };

    nextNotificationId += 1;
  };

  public shared ({ caller }) func sendAudioNotification(recipientId : Text, message : Text, audioData : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send notifications");
    };

    if (not userProfiles.containsKey(caller.toText())) {
      Runtime.trap("Sender must be registered");
    };

    let id = Nat64.fromNat(nextNotificationId);
    let notification : Notification = {
      id;
      sender = caller.toText();
      recipient = recipientId;
      message = #text(message);
      audioData = ?audioData;
      timestamp = Time.now();
      isRead = false;
    };

    notificationsStore.add(id, notification);

    switch (userNotifications.get(recipientId)) {
      case (?recipientNotifications) {
        recipientNotifications.add(id);
      };
      case (null) {
        let newNotifications = Set.fromIter(Iter.singleton(id));
        userNotifications.add(recipientId, newNotifications);
      };
    };

    nextNotificationId += 1;
  };

  public query ({ caller }) func getUserNotifications(userId : Text) : async [Notification] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own notifications");
    };

    switch (userNotifications.get(userId)) {
      case (?notifications) {
        notifications.toArray().map(
          func(notifId : Nat64) : Notification {
            switch (notificationsStore.get(notifId)) {
              case (?notif) { notif };
              case (null) {
                Runtime.trap("Notification not found");
              };
            };
          }
        );
      };
      case (null) {
        [];
      };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat64) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    switch (notificationsStore.get(notificationId)) {
      case (?notification) {
        if (notification.recipient != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };

        let updatedNotification : Notification = {
          notification with isRead = true;
        };
        notificationsStore.add(notificationId, updatedNotification);
      };
      case (null) {
        Runtime.trap("Notification not found");
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userProfiles.keys().toArray();
  };

  public query ({ caller }) func getAllNotifications() : async [Notification] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all notifications");
    };
    notificationsStore.values().toArray();
  };
};
