export default function compareVersions(
  currentVersion: number[],
  latestVersion: number[],
): boolean {
  for (let index = 0; index <= 3; index++) {
    const current = currentVersion[index];
    const latest = latestVersion[index];

    if (latest > current) {
      return true;
    } else if (latest === current) {
      continue;
    } else {
      return false;
    }
  }
  return false;
}
