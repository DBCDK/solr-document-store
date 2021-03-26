ALTER TABLE queuerule
  ADD COLUMN supplier TEXT NOT NULL DEFAULT 'manifestation';

ALTER TABLE queuerule
  ALTER COLUMN supplier DROP DEFAULT;

ALTER TABLE queuerule
  DROP CONSTRAINT queuerule_pkey;
ALTER TABLE queuerule
  ADD CONSTRAINT queuerule_pkey PRIMARY KEY (queue, supplier);

INSERT INTO queuerule(queue, supplier) SELECT queue, 'holding' FROM queuerule WHERE supplier = 'manifestation';

ALTER TABLE queuerule
  ADD COLUMN postpone INTEGER NOT NULL DEFAULT 0;

