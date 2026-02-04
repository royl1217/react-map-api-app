export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target =
      "https://mapapi.geodata.gov.hk" + url.pathname.replace("/hkmap", "");

    const response = await fetch(target);

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Content-Type": response.headers.get("Content-Type"),
      },
    });
  },
};
