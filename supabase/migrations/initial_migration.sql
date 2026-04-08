-- =============================================
-- EcoVilla - Migración Supabase
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New Query
-- =============================================

-- 1. Agregar columnas streak y total_kg a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_kg NUMERIC(10, 2) DEFAULT 0;

-- 2. Crear tabla de registros de reciclaje
CREATE TABLE IF NOT EXISTS public.recycling_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material    TEXT NOT NULL,
  quantity_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  location    TEXT NOT NULL DEFAULT 'Villavicencio',
  notes       TEXT,
  qr_code     TEXT,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Activar Row Level Security en recycling_logs
ALTER TABLE public.recycling_logs ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para recycling_logs
CREATE POLICY "Users can view own recycling logs"
  ON public.recycling_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recycling logs"
  ON public.recycling_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Permitir lectura pública de profiles (para leaderboard)
--    (Si ya existe una política DROP primero y vuelve a crearla)
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- 6. Función que actualiza puntos y kg en profiles al insertar un log
CREATE OR REPLACE FUNCTION public.handle_recycling_log_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    points    = points + NEW.points_earned,
    total_kg  = total_kg + NEW.quantity_kg,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger que llama a la función al insertar un reciclaje
DROP TRIGGER IF EXISTS on_recycling_log_insert ON public.recycling_logs;
CREATE TRIGGER on_recycling_log_insert
  AFTER INSERT ON public.recycling_logs
  FOR EACH ROW EXECUTE FUNCTION public.handle_recycling_log_insert();
