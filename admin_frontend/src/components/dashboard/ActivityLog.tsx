
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { getActivityLog } from "../../utils/reportUtils";

const ActivityLog = () => {
  const activityLog = getActivityLog();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Activity Log</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Activity Log</DialogTitle>
          <DialogDescription>
            Recent actions taken in the system
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {activityLog.map((log) => (
              <div key={log.id} className="flex flex-col border-b pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{log.user}</span>
                  <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                </div>
                <span>{log.action}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLog;
