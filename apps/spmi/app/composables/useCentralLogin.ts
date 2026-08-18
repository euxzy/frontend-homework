export function useCentralLogin() {
  const { signIn } = useAuth();

  async function login(credentials: { username: string; password: string; redirectTo: string }) {
    return signIn(
      { username: credentials.username, password: credentials.password },
      { callbackUrl: credentials.redirectTo },
    );
  }

  return { signIn: login };
}
