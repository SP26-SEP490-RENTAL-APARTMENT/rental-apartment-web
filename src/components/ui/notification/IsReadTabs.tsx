import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotifyItem from "./NotifyItem";
import type { Notification } from "@/types/notification";

interface Props {
  tab: "unread" | "read";
  setTab: (value: "unread" | "read") => void;
  notiList: Notification[];
  loading: boolean;
  onNotificationRead?: () => void;
}

function IsReadTabs({
  tab,
  setTab,
  notiList,
  loading,
  onNotificationRead,
}: Props) {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as "unread" | "read")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 rounded-none">
        <TabsTrigger value="unread">Unread</TabsTrigger>

        <TabsTrigger value="read">Read</TabsTrigger>
      </TabsList>

      <TabsContent value="unread" className="max-h-96 overflow-y-auto m-0">
        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notiList.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No unread notifications
          </div>
        ) : (
          <div className="divide-y">
            {notiList.map((notification) => (
              <NotifyItem
                key={notification.notificationId}
                data={notification}
                onNotificationRead={onNotificationRead}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="read" className="max-h-96 overflow-y-auto m-0">
        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : notiList.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No read notifications
          </div>
        ) : (
          <div className="divide-y">
            {notiList.map((notification) => (
              <NotifyItem
                key={notification.notificationId}
                data={notification}
                onNotificationRead={onNotificationRead}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default IsReadTabs;
