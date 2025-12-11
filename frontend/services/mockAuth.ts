// mock fra chat for nå 

type Role = "ansatt" | "forelder";

let mockUsers: Array<{ email: string; password: string; role: Role }> = [
  { email: "ao@mo.no", password: "123456", role: "ansatt" },
  { email: "fo@mo.no", password: "123456", role: "forelder" },
];

export async function mockLogin(email: string, password: string, role?: Role) {
  return new Promise<{ email: string; role: Role }>((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          (!role || u.role === role)
      );

      if (!user) {
        reject("Feil e-post, passord eller rolle");
      } else {
        resolve({ email: user.email, role: user.role });
      }
    }, 600);
  });
}

export async function mockRegister(
  email: string,
  password: string,
  role: Role = "forelder"
) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const exists = mockUsers.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        reject("E-post er allerede registrert");
        return;
      }

      mockUsers.push({ email, password, role });
      resolve();
    }, 600);
  });
}