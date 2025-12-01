import { ThreadCard } from "../ThreadCard";

export default function ThreadCardExample() {
  return (
    <ThreadCard
      id="1"
      title="Best study techniques for finals week?"
      category="academic"
      author="Anonymous"
      preview="I'm struggling with my study schedule and looking for tips on how to effectively prepare for multiple exams. Any advice from seniors would be greatly appreciated!"
      repliesCount={24}
      likesCount={47}
      lastActivity="2h ago"
      onClick={() => console.log("Thread clicked")}
    />
  );
}
