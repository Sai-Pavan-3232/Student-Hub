import { Home, Users, MessageSquare, BookOpen, Calendar, User } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Discover", url: "/discover", icon: Users },
  { title: "Forums", url: "/forums", icon: MessageSquare },
  { title: "Resources", url: "/resources", icon: BookOpen },
  { title: "Clubs", url: "/clubs", icon: Calendar },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden" data-testid="mobile-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.url;
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`mobile-nav-${item.title.toLowerCase()}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
