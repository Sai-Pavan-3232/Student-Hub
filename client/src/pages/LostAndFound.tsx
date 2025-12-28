import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Package } from "lucide-react";

const foundItems = [
  {
    id: "f1",
    title: "Black Backpack",
    whereFound: "2nd floor library, near the study booths",
    claimLocation: "Main library desk",
    date: "2025-11-28",
  },
  {
    id: "f2",
    title: "Silver iPhone (no case)",
    whereFound: "Cafeteria, table by window",
    claimLocation: "Student Services",
    date: "2025-11-30",
  },
];

const lostItems = [
  {
    id: "l1",
    title: "Blue Water Bottle",
    whereLost: "Gym locker area",
    contact: "Claim at Rec Center front desk",
    date: "2025-11-27",
  },
  {
    id: "l2",
    title: "Keys with red keychain",
    whereLost: "Lecture Hall B",
    contact: "Email lost@university.edu to claim",
    date: "2025-11-29",
  },
];

export default function LostAndFound() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-lost-and-found">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5" /> Lost &amp; Found
        </h1>
        <p className="text-muted-foreground mt-1">Report found items or look for lost belongings</p>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Found Items</h2>
          <Badge>Claimable</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foundItems.map((item) => (
            <Card key={item.id} className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm">Found on {item.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Where found: {item.whereFound}</p>
                <p className="text-sm text-muted-foreground">To claim: {item.claimLocation}</p>
                <div className="flex items-center justify-end">
                  <Button size="sm" variant="outline">Claim</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Lost Items</h2>
          <Badge>Seeking</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lostItems.map((item) => (
            <Card key={item.id} className="hover-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm">Lost on {item.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Where lost: {item.whereLost}</p>
                <p className="text-sm text-muted-foreground">Contact: {item.contact}</p>
                <div className="flex items-center justify-end">
                  <Button size="sm">Claim / Report</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
