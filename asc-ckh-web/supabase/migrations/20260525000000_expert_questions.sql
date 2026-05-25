-- Create Questions Status Enum
CREATE TYPE asc_ckh.question_status AS ENUM ('pending', 'answered', 'rejected');

-- Create Expert Questions Table
CREATE TABLE asc_ckh.expert_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  author_id UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  status asc_ckh.question_status DEFAULT 'pending'::asc_ckh.question_status NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES asc_ckh.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE asc_ckh.expert_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can view answered questions or their own questions
CREATE POLICY "Questions are viewable if answered or by author" ON asc_ckh.expert_questions
  FOR SELECT USING (status = 'answered'::asc_ckh.question_status OR auth.uid() = author_id);

-- Authenticated users can insert questions
CREATE POLICY "Users can submit questions" ON asc_ckh.expert_questions
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Note: Admins/Moderators will use service_role to answer/reject, or we could add a policy for them.
-- Since we are building an internal admin dashboard, we can use the Supabase Admin client or a trigger, 
-- but a policy for moderators is cleaner:
CREATE POLICY "Moderators can update questions" ON asc_ckh.expert_questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM asc_ckh.user_profiles
      WHERE id = auth.uid() AND role IN ('moderator'::asc_ckh.user_role, 'admin'::asc_ckh.user_role)
    )
  );
  
-- Also moderators need to be able to SELECT pending questions
CREATE POLICY "Moderators can view all questions" ON asc_ckh.expert_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM asc_ckh.user_profiles
      WHERE id = auth.uid() AND role IN ('moderator'::asc_ckh.user_role, 'admin'::asc_ckh.user_role)
    )
  );
