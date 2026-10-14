// Reviewers land on this page from a link, so the demo logins sit right here
// instead of only in the README.
const ACCOUNTS = [
  { username: "priya", password: "priya123" },
  { username: "arjun", password: "arjun123" },
];

export function DemoAccounts() {
  return (
    <div className="bg-muted mt-6 rounded-lg px-4 py-3 text-sm">
      <p className="font-medium">Demo accounts</p>
      <ul className="text-muted-foreground mt-1 grid gap-0.5">
        {ACCOUNTS.map((account) => (
          <li key={account.username}>
            <span className="text-foreground font-mono">{account.username}</span> /{" "}
            <span className="text-foreground font-mono">{account.password}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-2 text-xs">Each matchmaker sees only their own 12 customers.</p>
    </div>
  );
}
