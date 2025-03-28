import { DBCurrency } from "@/lib/supabase";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Profile } from "./profile-tab";
interface ProfileFormProps {
  onSubmit: (data: Omit<Profile, "email">) => void;
  initialData: Profile;
  currencies: DBCurrency[];
}

const ProfileForm = ({
  onSubmit,
  initialData,
  currencies = [],
}: ProfileFormProps) => {
  const { setTheme } = useTheme();
  const [name, setName] = useState(initialData?.name);
  const [currency, setCurrency] = useState(initialData?.currency);
  const [language, setLanguage] = useState(initialData?.language);
  const [theme, setThemeState] = useState(initialData?.theme || "system");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData.id,
      name,
      currency,
      language,
      theme,
    });
    setTheme(theme);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={initialData.email}
          placeholder="tu@email.com"
          disabled
        />
        <p className="text-xs text-muted-foreground">
          El correo electrónico no se puede cambiar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Moneda</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Seleccionar moneda" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((cur) => (
              <SelectItem key={cur.id} value={cur.id}>
                {cur.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Idioma</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Seleccionar idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Tema</Label>
        <Select
          value={theme}
          onValueChange={(value) =>
            setThemeState(value as "light" | "dark" | "system")
          }
        >
          <SelectTrigger id="theme">
            <SelectValue placeholder="Seleccionar tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Claro</SelectItem>
            <SelectItem value="dark">Oscuro</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
