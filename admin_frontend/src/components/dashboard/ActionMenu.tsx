
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "@/hooks/use-toast";

interface ActionMenuProps {
  incidentId: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ incidentId }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [actionTaken, setActionTaken] = useState(false);
  
  const handleDispatchTeam = () => {
    if (!selectedTeam) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a team to dispatch",
      });
      return;
    }
    
    toast({
      title: "Team Dispatched",
      description: `${selectedTeam} has been dispatched to incident #${incidentId}`,
    });
    
    setActionTaken(true);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {actionTaken ? (
          <Button variant="ghost" size="sm" disabled className="text-green-600">
            Action Taken
          </Button>
        ) : (
          <Button variant="outline" size="sm">Actions</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dispatch Response Team</DialogTitle>
          <DialogDescription>
            Select a team to dispatch for incident #{incidentId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedTeam} value={selectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Teams</SelectLabel>
                <SelectItem value="Team Alpha">Team Alpha</SelectItem>
                <SelectItem value="Team Bravo">Team Bravo</SelectItem>
                <SelectItem value="Team Charlie">Team Charlie</SelectItem>
                <SelectItem value="Team Delta">Team Delta</SelectItem>
                <SelectItem value="Special Response Unit">Special Response Unit</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleDispatchTeam} disabled={actionTaken}>
            {actionTaken ? "Team Dispatched" : "Dispatch Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionMenu;
