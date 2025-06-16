// src/pages/LoginPage.tsx
import { LoginFeature } from "../features/auth";

// Layout para centrar el contenido en la página
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginFeature />
    </AuthLayout>
  );
}