import { getCurrentProfile } from "@/lib/auth/get-current-profile";
import { CashRepository } from "@/lib/repositories/cash.repository";

export async function getOpenCash() {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error("Usuario no autenticado");
  }

  return await CashRepository.getOpenCash(
    profile.organization_id
  );
}