import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const memes = [
  {
    id: "m1",
    title: "When the deadline is tomorrow",
    img: "https://picsum.photos/seed/meme1/800/500",
    caption: "Me: I'll start tomorrow. Also me: still scrolling",
  },
  {
    id: "m2",
    title: "Group project logic",
    img: "https://picsum.photos/seed/meme2/800/500",
    caption: "One person: does all the work. Rest: congrats!",
  },
  {
    id: "m3",
    title: "Finals energy",
    img: "https://picsum.photos/seed/meme3/800/500",
    caption: "Coffee: 2 cups. Me: 6 cups",
  },
];

export default function Memes() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6" data-testid="page-memes">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Memes</h1>
        <p className="text-muted-foreground mt-1">A small collection of campus-appropriate memes to brighten your day.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {memes.map((m) => (
          <Card key={m.id} className="hover-elevate">
            <img src={m.img} alt={m.title} className="w-full h-48 object-cover rounded-t-md" />
            <CardHeader>
              <CardTitle>{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{m.caption}</p>
              <div className="flex justify-end">
                <Button size="sm">Share</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
