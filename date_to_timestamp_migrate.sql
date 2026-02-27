SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'gp_28168587'
AND table_name = 'jobstatus'
AND column_name LIKE '%date'
AND data_type IN ('date', 'timestamp without time zone');


SELECT 
    'ALTER TABLE gp_28168587.jobstatus ALTER COLUMN ' 
    || column_name || 
    ' TYPE timestamptz USING ' 
    || column_name || '::timestamptz;'
FROM information_schema.columns
WHERE table_schema = 'gp_28168587'
AND table_name = 'jobstatus'
AND column_name LIKE '%date'
AND data_type IN ('date', 'timestamp without time zone');


DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'gp_28168587'
        AND table_name = 'jobstatus'
        AND column_name LIKE '%date'
        AND data_type IN ('date', 'timestamp without time zone')
    LOOP
        EXECUTE format(
            'ALTER TABLE gp_28168587.jobstatus 
             ALTER COLUMN %I TYPE timestamptz 
             USING %I::timestamptz',
            r.column_name,
            r.column_name
        );
    END LOOP;
END $$;