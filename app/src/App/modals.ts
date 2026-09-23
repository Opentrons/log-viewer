import * as NiceModal from "@ebay/nice-modal-react"

import { TrustRobotIdentityModal } from "@/organisms/TrustRobotIdentityModal"

export function registerModals(): void {
  NiceModal.register("TrustRobotIdentityModal", TrustRobotIdentityModal)
}
