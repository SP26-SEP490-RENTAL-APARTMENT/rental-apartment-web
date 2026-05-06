import type { SupportTicket } from "@/types/supportTicket";

interface Props {
  support: SupportTicket;
}
function SupportAction({ support }: Props) {
  return <div>{support.priority}</div>;
}

export default SupportAction;
