//Payment API calls
export async function startCheckout(courseId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId }),
  });
  const data = await res.json();
  window.location.href = data.url; 
}


export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
  ...(options.body ? { "Content-Type": "application/json" } : {}),
  ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers });
  
  console.log("FETCH:", url, options, res.status);
  
  if (!res.ok) {
  const text = await res.text().catch(() => "");
  
  console.error("FETCH ERROR:", url, res.status, text);

  throw new Error(`Error ${res.status}: ${text}`);
}

  return res.json();
}

