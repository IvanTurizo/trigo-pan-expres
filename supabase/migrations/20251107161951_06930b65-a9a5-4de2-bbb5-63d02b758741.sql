-- Add INSERT policy: Only admins can assign roles
CREATE POLICY "Admins can assign roles"
  ON public.user_roles 
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add UPDATE policy: Only admins can modify role assignments
CREATE POLICY "Admins can update roles"
  ON public.user_roles 
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy: Only admins can delete role assignments
CREATE POLICY "Admins can delete roles"
  ON public.user_roles 
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));