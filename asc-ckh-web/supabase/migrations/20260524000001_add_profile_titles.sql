-- Add title_prefix and middle_initial to user_profiles
ALTER TABLE asc_ckh.user_profiles 
ADD COLUMN title_prefix TEXT,
ADD COLUMN middle_initial TEXT;
