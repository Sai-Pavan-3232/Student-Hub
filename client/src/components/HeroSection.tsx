interface HeroSectionProps {
  username?: string;
}

export function HeroSection({ username = "Student" }: HeroSectionProps) {
  return (
    <div className="rounded-lg p-6 md:p-8 bg-card" data-testid="hero-section">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {username}!</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Connect with your community and access resources to help you succeed.
      </p>
    </div>
  );
}
