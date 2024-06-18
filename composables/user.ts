import type { AuthResponse } from "~/services/AuthService";

export const useUser = () => {
  const user = useCookie<AuthResponse>('user');
  return user
}
