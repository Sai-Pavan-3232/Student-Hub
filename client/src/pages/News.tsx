import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

const newsItems = [
  {
    id: "n1",
    title: "Spring Club Fair Next Week",
    summary: "Over 50 student clubs will be showcasing activities and recruiting new members.",
    date: "2026-03-02",
    location: "Student Union Lawn",
  },
  {
    id: "n2",
    title: "Guest Lecture: AI and Society",
    summary: "Distinguished speaker from industry will discuss responsible AI and career paths.",
    date: "2026-03-05",
    location: "Engineering Auditorium",
  },
  {
    id: "n3",
    title: "Charity 5K Run",
    summary: "Join the annual 5K supporting local shelters. Register to participate or volunteer.",
    date: "2026-03-12",
    location: "Campus Track",
  },
];

export default function News() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-news">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Campus News</h1>
        <p className="text-muted-foreground mt-1">Latest events and announcements happening on campus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{item.summary}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm"><MapPin className="inline h-4 w-4 mr-1 align-text-bottom" /> {item.location}</p>
                <p className="text-sm text-muted-foreground mt-1"><Calendar className="inline h-4 w-4 mr-1 align-text-bottom" /> {item.date}</p>
              </div>
              <div className="flex-shrink-0">
                <Button size="sm">Read more</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
