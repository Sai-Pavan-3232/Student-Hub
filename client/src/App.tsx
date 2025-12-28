import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { SearchBar } from "@/components/SearchBar";
import { MobileNav } from "@/components/MobileNav";
import { ScrollArea } from "@/components/ui/scroll-area";

import Dashboard from "@/pages/Dashboard";
import Forums from "@/pages/Forums";
import Resources from "@/pages/Resources";
import Clubs from "@/pages/Clubs";
import ClubDetail from "@/pages/ClubDetail";
// Mentorship removed
import LostAndFound from "@/pages/LostAndFound";
import Memes from "@/pages/Memes";
import News from "@/pages/News";
import ThreadRoom from "@/pages/ThreadRoom";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/forums" component={Forums} />
      <Route path="/resources" component={Resources} />
      <Route path="/clubs/:id" component={ClubDetail} />
      <Route path="/clubs" component={Clubs} />
      {/* Mentorship route removed */}
      <Route path="/lost-and-found" component={LostAndFound} />
      <Route path="/memes" component={Memes} />
      <Route path="/news" component={News} />
      <Route path="/forums/thread/:id" component={ThreadRoom} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="student-hub-theme">
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <div className="hidden md:block">
                <AppSidebar />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="hidden md:flex" data-testid="button-sidebar-toggle" />
                    <div className="hidden sm:block w-64 lg:w-80">
                      <SearchBar placeholder="Search everything..." />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <NotificationBell />
                    <ThemeToggle />
                  </div>
                </header>
                <ScrollArea className="flex-1">
                  <main className="min-h-full">
                    <Router />
                  </main>
                </ScrollArea>
              </div>
            </div>
            <MobileNav />
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
