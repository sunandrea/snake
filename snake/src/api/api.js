class API {
  static baseURL = "https://snake-three-puce.vercel.app/api";

  static async getResults() {
    const response = await fetch(`${this.baseURL}/results`);
    if (!response.ok) {
      throw new Error("Failed to fetch results");
    }
    return await response.json();
  }

  static async postResult(name, score) {
    const response = await fetch(`${this.baseURL}/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    });
    if (!response.ok) {
      throw new Error("Failed to post result");
    }
    return await response.json();
  }
}

export default API;
