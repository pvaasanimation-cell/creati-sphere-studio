CREATE TABLE IF NOT EXISTS public.member_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_member_follows_following ON public.member_follows (following_id);
CREATE INDEX IF NOT EXISTS idx_member_follows_follower ON public.member_follows (follower_id);

ALTER TABLE public.member_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
  ON public.member_follows
  FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.member_follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.member_follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

ALTER TABLE public.members REPLICA IDENTITY FULL;