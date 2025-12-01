import heroImage from "@assets/generated_images/diverse_students_collaborating_campus.png";

interface HeroSectionProps {
  username?: string;
}

export function HeroSection({ username = "Student" }: HeroSectionProps) {
  return (
    <div
      className="relative rounded-lg overflow-hidden h-48 md:h-64"
      data-testid="hero-section"
    >
      <img
        src={heroImage}
        alt="Students collaborating"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-center p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, {username}!
        </h1>
        <p className="text-white/80 mt-2 max-w-md">
          Connect with your community, find mentors, and access resources to help you succeed.
        </p>
      </div>
    </div>
  );
}
