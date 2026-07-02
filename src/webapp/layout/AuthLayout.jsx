import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-glow auth-glow-one"></div>
      <div className="auth-glow auth-glow-two"></div>

      <section className="auth-wrapper">{children}</section>
    </main>
  );
}