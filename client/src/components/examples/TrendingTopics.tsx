import { TrendingTopics } from "../TrendingTopics";

export default function TrendingTopicsExample() {
  return (
    <div className="max-w-xs">
      <TrendingTopics onTopicClick={(id) => console.log("Topic clicked:", id)} />
    </div>
  );
}
