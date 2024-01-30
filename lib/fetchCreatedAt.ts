export default async function fetchCreatedAt(pkg: string) {
  if (!pkg) {
    throw new Error("No package name specified");
  }
  let createdAt = await fetch(`https://registry.npmjs.org/${pkg}`)
    .then((res) => {
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Package not found");
        }
        throw new Error("Something went wrong");
      }
      return res;
    })
    .then((res) => res.json())
    .then((json) => {
      return json?.time?.created ?? "";
    });
  return createdAt;
}
