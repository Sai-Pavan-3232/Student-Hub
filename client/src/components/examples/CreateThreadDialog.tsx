import { CreateThreadDialog } from "../CreateThreadDialog";

export default function CreateThreadDialogExample() {
  return (
    <CreateThreadDialog
      onSubmit={(data) => console.log("Thread created:", data)}
    />
  );
}
