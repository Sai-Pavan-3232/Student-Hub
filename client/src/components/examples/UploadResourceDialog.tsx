import { UploadResourceDialog } from "../UploadResourceDialog";

export default function UploadResourceDialogExample() {
  return (
    <UploadResourceDialog
      onSubmit={(data) => console.log("Resource uploaded:", data)}
    />
  );
}
