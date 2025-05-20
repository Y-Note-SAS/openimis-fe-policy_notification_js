import messages_en from "./translations/en.json";
import FamilyNotificationPickers from "./components/FamilyNotificationPickers";
import NotificationEnabledModePicker from "./components/NotificationEnabledModePicker";
import FamilyNotificationReport from "./components/FamilyNotificationReport";
import reducer from "./reducer";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'PolicyNotification', reducer }],
  "insuree.Family.master": [FamilyNotificationPickers],
  "insuree.FamilyFilters": [NotificationEnabledModePicker],
  "insuree.FamilyActions": [FamilyNotificationReport],
  "refs": [
    { key: "policy_notification.NotificationEnabledModePicker", ref: NotificationEnabledModePicker },
  ]
}

export const PolicyNotificationModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}