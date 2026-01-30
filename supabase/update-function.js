const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '../frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in frontend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
  -- Drop old function if exists, then create new safe version
  DROP FUNCTION IF EXISTS public.cleanup_all_old_data();

  create or replace function public.cleanup_all_old_data()
  returns json as $$
  declare
    logs_deleted integer;
    topics_deleted integer;
    lecturers_deleted integer;
  begin
    -- Delete old history logs for current user (3 days)
    delete from public.history_logs 
    where user_id = auth.uid() and created_at < now() - interval '3 days';
    get diagnostics logs_deleted = row_count;
    
    -- Delete old saved topics for current user (30 days)
    delete from public.saved_topics 
    where user_id = auth.uid() and created_at < now() - interval '30 days';
    get diagnostics topics_deleted = row_count;
    
    -- Delete old interested lecturers for current user (30 days)
    delete from public.interested_lecturers 
    where user_id = auth.uid() and created_at < now() - interval '30 days';
    get diagnostics lecturers_deleted = row_count;
    
    return json_build_object(
      'logs_deleted', logs_deleted,
      'topics_deleted', topics_deleted,
      'lecturers_deleted', lecturers_deleted
    );
  end;
  $$ language plpgsql security definer;
`;

async function updateFunction() {
  console.log('Updating cleanup_all_old_data function in Supabase...');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

  if (error) {
    // RPC might not exist, try raw query
    console.log('RPC not available, trying raw query...');
    
    const { error: queryError } = await supabase.from('graphql_query').select('*').limit(0);
    
    if (queryError) {
      console.error('Cannot execute raw SQL directly via client.');
      console.error('Please run the SQL manually in Supabase SQL Editor:');
      console.log('-------------------------------------------');
      console.log(sql);
      console.log('-------------------------------------------');
      return;
    }
  }
  
  console.log('Function updated successfully!');
}

updateFunction();
