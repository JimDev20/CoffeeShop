import { BaseService } from "./BaseService";
import bcrypt from "bcryptjs";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export class AuthService extends BaseService {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const rows = await this.db`SELECT * FROM users WHERE email = ${email}`;
    return (rows[0] as AuthUser | undefined) ?? null;
  }

  async register(data: RegisterDTO): Promise<RegisteredUser> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const [user] = await this.db`
      INSERT INTO users (name, email, password, role)
      VALUES (${data.name}, ${data.email}, ${hashedPassword}, 'customer')
      RETURNING id, name, email, role, created_at
    `;
    return user as unknown as RegisteredUser;
  }

  async validateCredentials(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
