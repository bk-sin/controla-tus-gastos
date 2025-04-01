// app/api/process-installments/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Verificar si es el primer día del mes
    const today = new Date();
    if (today.getDate() !== 1) {
      return NextResponse.json(
        { error: "Solo se puede ejecutar el primer día del mes" },
        { status: 403 }
      );
    }

    // Ejecutar el procedimiento de cuotas
    const { error: installmentError } = await supabase.rpc(
      "process_monthly_installments"
    );

    if (installmentError) {
      console.error("Error procesando cuotas:", installmentError);
      return NextResponse.json(
        { error: installmentError.message },
        { status: 500 }
      );
    }

    // Reiniciar gastos variables (si tienes una función para esto)
    const { error: expensesError } = await supabase.rpc(
      "reset_monthly_expenses"
    );

    if (expensesError) {
      console.error("Error reiniciando gastos:", expensesError);
      return NextResponse.json(
        { error: expensesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Proceso mensual completado exitosamente",
    });
  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
