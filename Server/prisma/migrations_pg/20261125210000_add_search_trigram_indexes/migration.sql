CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Task_title_trgm_idx"
  ON "Task" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "Goal_title_trgm_idx"
  ON "Goal" USING GIN ("title" gin_trgm_ops);

CREATE INDEX "Event_title_trgm_idx"
  ON "Event" USING GIN ("title" gin_trgm_ops);
