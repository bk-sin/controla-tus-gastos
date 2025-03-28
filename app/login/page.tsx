import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Finanzas Personales</h1>
      <LoginForm />
    </div>
  )
}

