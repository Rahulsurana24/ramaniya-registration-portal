create policy "authenticated admins update registrations" on public.daughter_registrations for update to authenticated using (true) with check (true);
create policy "authenticated admins delete registrations" on public.daughter_registrations for delete to authenticated using (true);
