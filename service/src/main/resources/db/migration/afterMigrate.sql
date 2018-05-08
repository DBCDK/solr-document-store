DO
$$
DECLARE
    has BOOLEAN;
    current_table_name TEXT;
    current_column_list TEXT;
    stmt TEXT;
BEGIN
    FOR current_table_name IN SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE '%default' LOOP
        RAISE NOTICE 'table %', current_table_name;
        SELECT STRING_AGG(column_name, ', ') INTO current_column_list FROM information_schema.columns WHERE table_name=LEFT(current_table_name, -7) AND table_schema='public';
       
        RAISE NOTICE 'column %', current_column_list;
        stmt := 'INSERT INTO ' || LEFT(current_table_name, -7) ||
                '(' || current_column_list || ')' ||
                ' SELECT ' || current_column_list || 
                ' FROM ' || current_table_name;
        RAISE NOTICE 'stmt %', stmt;
        EXECUTE stmt;
        stmt := 'TRUNCATE ' || current_table_name;
        RAISE NOTICE 'stmt %', stmt;
        EXECUTE stmt;
    END LOOP;
END
$$;
