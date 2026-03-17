
-- Create a SECURITY DEFINER function to create member profiles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_member_profile(
  _user_id uuid,
  _name text,
  _username text,
  _country text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.members (user_id, name, username, country)
  VALUES (_user_id, _name, _username, _country);
END;
$$;
