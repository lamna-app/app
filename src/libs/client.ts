import moment from "moment";

import { Message, User } from "~/types";
import { tempGetCookie, tempSetCookie } from "./store";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type RequestResponse<T> = { data: T; status: number };

class Route {
  private static BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

  method: Method;
  path: string;
  query?: Record<string, any>;
  slug?: Record<string, any>;

  constructor(
    method: Method,
    path: string,
    options?: { query?: Record<string, any>; slug?: Record<string, any> },
  ) {
    this.method = method;
    this.path = path;
    this.query = options?.query;
    this.slug = options?.slug;
  }

  private substitute(path: string, lookup: Record<string, any>): string {
    return path.replace(/{([^}]+)}/g, (_, key) => {
      const slug = lookup[key];
      if (!slug) {
        throw new Error(`Could not substitute ${key} in ${path}.`);
      }

      return slug;
    });
  }

  get url() {
    const path = this.slug ? this.substitute(this.path, this.slug) : this.path;

    let url = `${Route.BASE}${path}`;
    if (this.query) {
      const params = new URLSearchParams(this.query);
      url += `?${params.toString()}`;
    }

    return url;
  }
}

class Client {
  private token?: string;
  private refresh_token?: string;

  private getHeaders(route: Route): Record<string, string> {
    if (route.path === "/refresh") {
      if (!this.refresh_token) {
        this.refresh_token = tempGetCookie("lamna-refresh");
      }
      return { Authorisation: `Bearer ${this.refresh_token}` };
    } else {
      if (!this.token) {
        this.token = tempGetCookie("lamna-auth");
      }
      return { Authorisation: `Bearer ${this.token}` };
    }
  }

  private async request<T>(
    route: Route,
    body?: Record<string, any>,
    options?: {
      refresh: boolean;
    },
  ): Promise<RequestResponse<T>> {
    const authHeaders = this.getHeaders(route);

    const response = await fetch(route.url, {
      body: body ? JSON.stringify(body) : null,
      method: route.method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `LamnaClient (v0)`,
        ...authHeaders,
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (options?.refresh ?? true) {
          await this.refresh();
          return await this.request<any>(route, body);
        }
      }
      const error = await response.text();

      throw new Error(error);
    }

    return {
      data: await response.json(),
      status: response.status,
    };
  }

  public async refresh() {
    const route = new Route("POST", "/refresh");

    type RefreshResponse = { auth_token: string; refresh_token: string };
    const { data } = await this.request<RefreshResponse>(route);

    this.token = data.auth_token;
    this.refresh_token = data.refresh_token;

    tempSetCookie("lamna-auth", this.token);
    tempSetCookie("lamna-refresh", this.refresh_token);
  }

  public async login(username: string, password: string) {
    const route = new Route("POST", "/login");

    type LoginResponse = {
      user: User;
      auth_token: string;
      refresh_token: string;
    };

    const response = await this.request<LoginResponse>(
      route,
      {
        username,
        password,
      },
      { refresh: false },
    );

    return response;
  }

  public async me() {
    const route = new Route("GET", "/@me");

    const response = await this.request<User>(route);
    return response;
  }

  public async createMessage(content: string, channel_id: number) {
    const route = new Route("POST", "/channels/{channel_id}/messages", { slug: { channel_id } });

    const response = await this.request<Message>(route, { content });

    return response;
  }

  public async channelHistory(channel_id: number) {
    const route = new Route("GET", "/channels/{channel_id}/messages", { slug: { channel_id } });

    const response = await this.request<Message[]>(route);

    response.data = response.data.map(message => {
      return {
        ...message,
        timestamp: moment(message.timestamp, moment.ISO_8601),
      } satisfies Message;
    });

    return response;
  }

  public async signup(username: string, email: string, password: string) {
    const route = new Route("POST", "/signup");

    type SignupResponse = {
      user: User;
      auth_token: string;
      refresh_token: string;
    };

    const response = await this.request<SignupResponse>(route, {
      username,
      email,
      password,
    });

    return response;
  }
}

// probably delegate creation to iother file
export const APIClient = new Client();
