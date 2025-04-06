
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

const SearchReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search & Reports</h1>
        <p className="text-muted-foreground">
          Find incidents and generate custom reports
        </p>
      </div>

      <Card className="bg-muted/40">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search by keyword, incident ID, or location</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. INC-5723, robbery, Connaught Place..."
                  className="pl-9"
                />
              </div>
            </div>
            <Button className="gap-2">
              <Search className="h-4 w-4" /> Search
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Advanced Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card text-card-foreground">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No search performed</h3>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Use the search field above to find incidents by keyword, ID, or location.
            <br />
            For more specific queries, try the Advanced Filter option.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm">
              Recent Incidents
            </Button>
            <Button variant="outline" size="sm">
              This Month
            </Button>
            <Button variant="outline" size="sm">
              Violent Crimes
            </Button>
            <Button variant="outline" size="sm">
              Pending Verification
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchReports;
