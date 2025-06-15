
-- Create a table for sessions
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Note: Storing passwords in plain text is not secure. We should implement hashing later.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for participants in a session
CREATE TABLE public.session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for retrospectives
CREATE TABLE public.retros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  retro_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an enum type for retro columns
CREATE TYPE public.retro_column_type AS ENUM ('well', 'improve', 'start');

-- Create a table for retro items
CREATE TABLE public.retro_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  retro_id UUID NOT NULL REFERENCES public.retros(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.session_participants(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  column_type public.retro_column_type NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for action items
CREATE TABLE public.action_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  retro_id UUID NOT NULL REFERENCES public.retros(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.session_participants(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retro_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- For now, we'll allow all access. We'll add stricter rules later on.
CREATE POLICY "Allow public access to sessions" ON public.sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to session_participants" ON public.session_participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to retros" ON public.retros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to retro_items" ON public.retro_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to action_items" ON public.action_items FOR ALL USING (true) WITH CHECK (true);
