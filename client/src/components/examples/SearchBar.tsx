import { SearchBar } from "../SearchBar";

export default function SearchBarExample() {
  return (
    <SearchBar
      placeholder="Search forums, resources, clubs..."
      onSearch={(query) => console.log("Search:", query)}
    />
  );
}
