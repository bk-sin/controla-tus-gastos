"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { atom, useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CreditCard, ExpenseCategory } from "../dashboard";

import { useUser } from "@/lib/hooks/use-user";
import { creditCardService } from "@/lib/services/credit-card-service";
import { userSettingsService } from "@/lib/services/user-settings-service";
import { DBCurrency, DbUserSettings } from "@/lib/supabase";
import { CategoriesTab } from "./category-tab";
import { CreditCardTab } from "./credit-card-tab";
import { Profile, ProfileTab } from "./profile-tab";
import { Toast } from "./toast";

export const settingsAtom = atom("profile");
export const cardsAtom = atom<CreditCard[]>([]);

export const SettingsPage = ({
  profile,
  categories,
  cards,
  currencies,
}: {
  profile: DbUserSettings;
  categories: ExpenseCategory[];
  cards: CreditCard[];
  currencies: DBCurrency[];
}) => {
  const [activeTab, setActiveTab] = useAtom(settingsAtom);
  const [localCards, setLocalCards] = useAtom(cardsAtom);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleCategorySave = async (expense: ExpenseCategory) => {
    try {
      setToast({
        message: expense?.id ? "Categoría actualizada" : "Categoría agregada",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "Error al guardar", type: "error" });
    }
  };

  const handleCreateCreditCardSave = async (
    creditCard: Omit<CreditCard, "id">
  ) => {
    try {
      const newCard = await creditCardService.addCreditCard(creditCard);

      setLocalCards((prev) => [
        ...prev,
        { ...newCard, color: creditCard.color },
      ]);
      setToast({
        message: "Tarjeta de Crédito agregada",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({ message: "Error al guardar", type: "error" });
      throw error;
    }
  };

  const handleUpdateCreditCardSave = async (creditCard: CreditCard) => {
    try {
      const updatedCard = await creditCardService.updateCreditCard(creditCard);

      setLocalCards((prevCards) =>
        prevCards.map((card) =>
          card.id === creditCard.id ? { ...card, ...updatedCard } : card
        )
      );

      setToast({
        message: "Tarjeta de Crédito actualizada",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setToast({ message: "Error al guardar", type: "error" });
      throw error;
    }
  };

  const handleCategoryDelete = async (id: string) => {
    try {
      setToast({ message: "Categoría eliminada", type: "success" });
    } catch (error) {
      setToast({ message: "Error al eliminar", type: "error" });
    }
  };

  const handleCreditCardDelete = async (id: string) => {
    try {
      await creditCardService.deleteCreditCard(id);
      setLocalCards((prevCards) => prevCards.filter((card) => card.id !== id));
      setToast({ message: "Tarjeta de Crédito eliminada", type: "success" });
    } catch (error) {
      setToast({ message: "Error al eliminar", type: "error" });
      throw error;
    }
  };

  const handleUserSettingsSave = async (data: Omit<Profile, "email">) => {
    try {
      await userSettingsService.updateUserProfile(data);
      setToast({
        message: "Tu perfil fue actualizado correctamente",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "Error al eliminar", type: "error" });
      throw error;
    }
  };

  const { user } = useUser();

  return (
    <div className="container mx-auto py-6 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Administra tu perfil, tarjetas de crédito y categorías de gastos
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </Link>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="historical">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileTab
            onUpdate={handleUserSettingsSave}
            profile={{ ...profile, email: user?.email || "" } as Profile}
            currencies={currencies}
          />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab
            categories={categories}
            onSave={handleCategorySave}
            onDelete={handleCategoryDelete}
          />
        </TabsContent>
        <TabsContent value="cards">
          <CreditCardTab
            cards={localCards}
            onCreate={handleCreateCreditCardSave}
            onUpdate={handleUpdateCreditCardSave}
            onDelete={handleCreditCardDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
