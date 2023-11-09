import axios from '../axios';
import { UserModel } from "../models/User";

class AuthService {
  setUserInLocalStorage(data: UserModel) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  async login(username: string, password: string): Promise<UserModel> {
    const { data } = await axios.post('auth-token/', { username, password })

    if (!data.token) {
      return data;
    }

    this.setUserInLocalStorage(data);
    return data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user')!;
    return JSON.parse(user);
  }
}

export default new AuthService();